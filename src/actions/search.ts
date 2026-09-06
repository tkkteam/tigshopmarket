'use server';

import prisma from '@/lib/prisma';

export async function searchProducts(query: string) {
  if (!query || query.trim() === '') {
    return [];
  }

  const searchTerm = query.trim().toLowerCase();

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { sku: { contains: searchTerm, mode: 'insensitive' } },
        { category: { name: { contains: searchTerm, mode: 'insensitive' } } }
      ]
    },
    take: 5,
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1
      },
      category: true
    }
  });

  return products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    imageUrl: p.images[0]?.imageUrl || 'https://via.placeholder.com/150?text=No+Image',
    categoryName: p.category.name
  }));
}
