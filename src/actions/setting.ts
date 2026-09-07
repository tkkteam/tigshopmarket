'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  let setting = await prisma.setting.findFirst();
  if (!setting) {
    setting = await prisma.setting.create({
      data: {
        siteName: 'TigShop Market',
      }
    });
  }
  return setting;
}

export async function updateSettings(formData: FormData) {
  const facebook = formData.get('facebook') as string;
  const lineId = formData.get('lineId') as string;
  const youtube = formData.get('youtube') as string;
  
  const setting = await prisma.setting.findFirst();
  
  if (setting) {
    await prisma.setting.update({
      where: { id: setting.id },
      data: {
        facebook: facebook || '',
        lineId: lineId || '',
        youtube: youtube || '',
      }
    });
  } else {
    await prisma.setting.create({
      data: {
        siteName: 'TigShop Market',
        facebook: facebook || '',
        lineId: lineId || '',
        youtube: youtube || '',
      }
    });
  }
  
  revalidatePath('/');
  revalidatePath('/admin/settings');
}
