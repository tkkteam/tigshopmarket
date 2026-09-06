'use server';

import prisma from '@/lib/prisma';
import { uploadImageToR2 } from '@/lib/cloudflareR2';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addProduct(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string) || 0;
    const packageSize = formData.get('packageSize') as string;
    const buyLink = formData.get('buyLink') as string;
    const categoryId = formData.get('categoryId') as string;
    const imageFile = formData.get('image') as File | null;

    if (!name || !price || !categoryId) {
      throw new Error('Missing required fields');
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku: 'SKU-' + Date.now(),
        description: description || '',
        price,
        stock,
        packageSize: packageSize || '',
        buyLink: buyLink || '',
        categoryId,
      },
    });

    if (imageFile && imageFile.size > 0) {
      const { fileId, imageUrl } = await uploadImageToR2(imageFile);
      await prisma.productImage.create({
        data: {
          productId: product.id,
          imageUrl,
          fileId,
          sortOrder: 0,
        },
      });
    }
  } catch (error: any) {
    console.error("Action Error:", error);
    throw new Error("Failed to save product: " + error.message);
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect('/admin/products');
}

export async function deleteProduct(productId: string) {
  // Delete related images first
  await prisma.productImage.deleteMany({
    where: { productId },
  });
  
  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function addCategory(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  await prisma.category.create({
    data: { name, slug }
  });
  revalidatePath('/admin/products/new');
  revalidatePath('/');
}

export async function updateProduct(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string) || 0;
    const packageSize = formData.get('packageSize') as string;
    const buyLink = formData.get('buyLink') as string;
    const categoryId = formData.get('categoryId') as string;
    const imageFile = formData.get('image') as File | null;

    if (!id || !name || !price || !categoryId) {
      throw new Error('Missing required fields');
    }

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || '',
        price,
        stock,
        packageSize: packageSize || '',
        buyLink: buyLink || '',
        categoryId,
      },
    });

    if (imageFile && imageFile.size > 0) {
      const { fileId, imageUrl } = await uploadImageToR2(imageFile);
      
      // Delete old images first (for simplicity, we keep 1 image per product)
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });

      await prisma.productImage.create({
        data: {
          productId: id,
          imageUrl,
          fileId,
          sortOrder: 0,
        },
      });
    }
  } catch (error: any) {
    console.error("Update Error:", error);
    throw new Error("Failed to update product: " + error.message);
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect('/admin/products');
}

export async function clearMockData() {
  // Clear all mock data (or all data)
  await prisma.productImage.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({ where: { role: 'CUSTOMER' } });
  
  revalidatePath('/');
  revalidatePath('/admin/products');
}
