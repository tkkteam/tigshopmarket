'use server';

import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

async function getIpAddress() {
  const headersList = await headers();
  // Vercel / Next.js headers
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = headersList.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return 'unknown-ip';
}

export async function toggleLike(productId: string, currentPath: string) {
  const ipAddress = await getIpAddress();
  if (ipAddress === 'unknown-ip') return { success: false, message: 'Cannot detect IP' };

  try {
    const existingLike = await prisma.productLike.findUnique({
      where: {
        productId_ipAddress: {
          productId,
          ipAddress
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.productLike.delete({
          where: { id: existingLike.id }
        }),
        prisma.product.update({
          where: { id: productId },
          data: { likesCount: { decrement: 1 } }
        })
      ]);
    } else {
      // Like
      await prisma.$transaction([
        prisma.productLike.create({
          data: { productId, ipAddress }
        }),
        prisma.product.update({
          where: { id: productId },
          data: { likesCount: { increment: 1 } }
        })
      ]);
    }

    revalidatePath(currentPath);
    return { success: true };
  } catch (error) {
    console.error('Like toggle error:', error);
    return { success: false, message: 'Failed to toggle like' };
  }
}
