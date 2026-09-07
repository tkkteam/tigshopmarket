import prisma from '@/lib/prisma';
import { updateProduct, setMainImage, deleteProductImage } from '@/actions/product';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ImageUploadBox from '@/components/ImageUploadBox';
import { Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { 
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    }),
    prisma.category.findMany({
      orderBy: { createdAt: 'desc' }
    })
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-gray-500 hover:text-gray-800">
          ← กลับ
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">แก้ไขสินค้า: {product.name}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">รูปปัจจุบัน ({product.images.length}/9)</h2>
        {product.images.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {product.images.map((img, index) => (
              <div key={img.id} className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden border group">
                <Image src={img.imageUrl} alt={product.name} fill className="object-cover" />
                
                {index === 0 ? (
                  <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-br z-10 font-medium shadow-sm">ภาพหลัก</div>
                ) : (
                  <div className="absolute top-0 left-0 w-full p-1 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-start z-20">
                    <form action={async () => {
                      'use server';
                      await setMainImage(product.id, img.id);
                    }}>
                      <button type="submit" className="text-white text-[10px] bg-black/60 hover:bg-black px-1.5 py-0.5 rounded shadow-sm">
                        ตั้งเป็นภาพหลัก
                      </button>
                    </form>
                  </div>
                )}
                
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <form action={async () => {
                    'use server';
                    await deleteProductImage(product.id, img.id);
                  }}>
                    <button type="submit" className="text-white bg-red-500/80 hover:bg-red-600 p-1 rounded shadow-sm">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </form>
                </div>
                
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">ไม่มีรูปภาพ</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form action={updateProduct} className="space-y-4">
          <input type="hidden" name="id" value={product.id} />
          
          <div>
            <label className="block text-sm font-medium mb-1">ชื่อสินค้า</label>
            <input type="text" name="name" defaultValue={product.name} className="w-full border rounded px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ราคา (บาท)</label>
            <input type="number" name="price" defaultValue={product.price} className="w-full border rounded px-3 py-2" required min="0" step="0.01" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">จำนวนสต็อก (ชิ้น)</label>
            <input type="number" name="stock" defaultValue={product.stock} className="w-full border rounded px-3 py-2" required min="0" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ขนาดพัสดุ (เช่น กล่อง A, 20x30x10 cm)</label>
            <input type="text" name="packageSize" defaultValue={product.packageSize || ''} className="w-full border rounded px-3 py-2" placeholder="กรอกขนาดพัสดุ" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ลิงก์สำหรับสั่งซื้อ (URL ภายนอก เช่น Shopee, LINE)</label>
            <input type="url" name="buyLink" defaultValue={product.buyLink || ''} className="w-full border rounded px-3 py-2" placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">หมวดหมู่</label>
            <select name="categoryId" defaultValue={product.categoryId} className="w-full border rounded px-3 py-2" required>
              <option value="">-- เลือกหมวดหมู่ --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">รายละเอียด</label>
            <textarea name="description" defaultValue={product.description} className="w-full border rounded px-3 py-2" rows={4}></textarea>
          </div>

          <div className="border-t pt-4 mt-4">
            <ImageUploadBox maxImages={9} existingImagesCount={product.images.length} />
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
              อัปเดตข้อมูลสินค้า
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
