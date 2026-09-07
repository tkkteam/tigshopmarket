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
    const brand = formData.get('brand') as string;
    const weight = formData.get('weight') as string;
    const warranty = formData.get('warranty') as string;
    const condition = formData.get('condition') as string;
    const imageFiles = formData.getAll('images') as File[];

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
        brand: brand || 'No Brand',
        weight: weight || '',
        warranty: warranty || 'ไม่มีประกัน',
        condition: condition || 'ของใหม่',
      },
    });

    if (imageFiles && imageFiles.length > 0) {
      const filesToUpload = imageFiles.filter(f => f.size > 0).slice(0, 9);
      let sortOrder = 0;
      for (const file of filesToUpload) {
        const { fileId, imageUrl } = await uploadImageToR2(file);
        await prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl,
            fileId,
            sortOrder: sortOrder++,
          },
        });
      }
    }
  } catch (error: unknown) {
    console.error("Action Error:", error);
    throw new Error("Failed to save product: " + (error instanceof Error ? error.message : String(error)));
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
  let slug = name.toLowerCase().replace(/[^a-z0-9ก-๙]+/g, '-');
  if (!slug || slug === '-') {
    slug = 'category';
  }
  slug = `${slug}-${Date.now()}`;
  
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
    const brand = formData.get('brand') as string;
    const weight = formData.get('weight') as string;
    const warranty = formData.get('warranty') as string;
    const condition = formData.get('condition') as string;
    const imageFiles = formData.getAll('images') as File[];

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
        brand: brand || 'No Brand',
        weight: weight || '',
        warranty: warranty || 'ไม่มีประกัน',
        condition: condition || 'ของใหม่',
      },
    });

    if (imageFiles && imageFiles.length > 0) {
      const validFiles = imageFiles.filter(f => f.size > 0);
      if (validFiles.length > 0) {
        // Count existing images to not exceed 9
        const existingImagesCount = await prisma.productImage.count({
          where: { productId: id }
        });

        const availableSlots = Math.max(0, 9 - existingImagesCount);
        const filesToUpload = validFiles.slice(0, availableSlots);

        if (filesToUpload.length > 0) {
          // Get max sort order
          const maxSortImage = await prisma.productImage.findFirst({
            where: { productId: id },
            orderBy: { sortOrder: 'desc' }
          });
          let sortOrder = maxSortImage ? maxSortImage.sortOrder + 1 : 0;

          for (const file of filesToUpload) {
            const { fileId, imageUrl } = await uploadImageToR2(file);
            
            await prisma.productImage.create({
              data: {
                productId: id,
                imageUrl,
                fileId,
                sortOrder: sortOrder++,
              },
            });
          }
        }
      }
    }
  } catch (error: unknown) {
    console.error("Update Error:", error);
    throw new Error("Failed to update product: " + (error instanceof Error ? error.message : String(error)));
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

export async function setMainImage(productId: string, imageId: string) {
  const images = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: 'asc' }
  });

  const otherImages = images.filter(img => img.id !== imageId);
  const selectedImage = images.find(img => img.id === imageId);

  if (!selectedImage) return;

  const newOrder = [selectedImage, ...otherImages];

  for (let i = 0; i < newOrder.length; i++) {
    await prisma.productImage.update({
      where: { id: newOrder[i].id },
      data: { sortOrder: i }
    });
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath('/');
}
export async function deleteProductImage(productId: string, imageId: string) {
  await prisma.productImage.delete({
    where: { id: imageId }
  });

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath('/');
}
