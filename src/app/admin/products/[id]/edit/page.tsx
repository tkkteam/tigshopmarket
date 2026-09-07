import prisma from '@/lib/prisma';
import { updateProduct, setMainImage, deleteProductImage } from '@/actions/product';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ImageUploadBox from '@/components/ImageUploadBox';
import { Trash2 } from 'lucide-react';
import ClientForm from '@/components/ClientForm';

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
                    <ClientForm action={async () => {
                      'use server';
                      await setMainImage(product.id, img.id);
                    }} successMessage="ตั้งภาพหลักสำเร็จ!">
                      <button type="submit" className="text-white text-[10px] bg-black/60 hover:bg-black px-1.5 py-0.5 rounded shadow-sm">
                        ตั้งเป็นภาพหลัก
                      </button>
                    </ClientForm>
                  </div>
                )}
                
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <ClientForm action={async () => {
                    'use server';
                    await deleteProductImage(product.id, img.id);
                  }} successMessage="ลบรูปภาพสำเร็จ!">
                    <button type="submit" className="text-white bg-red-500/80 hover:bg-red-600 p-1 rounded shadow-sm">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </ClientForm>
                </div>
                
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">ไม่มีรูปภาพ</p>
        )}
      </div>

      <ClientForm action={updateProduct} className="space-y-6" successMessage="อัปเดตข้อมูลสินค้าเรียบร้อยแล้ว!">
        <input type="hidden" name="id" value={product.id} />
        
        {/* Section 1: ข้อมูลทั่วไป */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-primary">1. ข้อมูลทั่วไป</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">ชื่อสินค้า <span className="text-red-500">*</span></label>
              <input type="text" name="name" defaultValue={product.name} className="w-full border rounded px-3 py-2" required placeholder="เช่น เสื้อยืดแขนสั้นลายทาง" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">หมวดหมู่ <span className="text-red-500">*</span></label>
              <select name="categoryId" defaultValue={product.categoryId} className="w-full border rounded px-3 py-2" required>
                <option value="">-- เลือกหมวดหมู่ --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: คุณลักษณะของสินค้า */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-primary">2. คุณลักษณะของสินค้า</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">แบรนด์</label>
              <input type="text" name="brand" defaultValue={product.brand || 'No Brand'} list="brands" className="w-full border rounded px-3 py-2" placeholder="เลือกหรือพิมพ์แบรนด์ใหม่" />
              <datalist id="brands">
                <option value="No Brand" />
                <option value="TIG" />
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">สภาพสินค้า</label>
              <select name="condition" defaultValue={product.condition || 'ของใหม่'} className="w-full border rounded px-3 py-2">
                <option value="ของใหม่">ของใหม่</option>
                <option value="มือ 2">มือ 2</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ระยะเวลาการรับประกัน</label>
              <select name="warranty" defaultValue={product.warranty || 'ไม่มีประกัน'} className="w-full border rounded px-3 py-2">
                <option value="ไม่มีประกัน">ไม่มีประกัน</option>
                <option value="1 เดือน">1 เดือน</option>
                <option value="2 เดือน">2 เดือน</option>
                <option value="3 เดือน">3 เดือน</option>
                <option value="6 เดือน">6 เดือน</option>
                <option value="1 ปี">1 ปี</option>
                <option value="2 ปี">2 ปี</option>
                <option value="3 ปี">3 ปี</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: รายละเอียด */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-primary">3. รายละเอียด</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">รายละเอียดสินค้า</label>
              <textarea name="description" defaultValue={product.description} className="w-full border rounded px-3 py-2" rows={5} placeholder="ใส่รายละเอียดสินค้าของคุณ..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 border-b pb-2">อัปโหลดรูปภาพเพิ่มเติม (สูงสุด 9 รูปรวมของเดิม)</label>
              <ImageUploadBox maxImages={9} existingImagesCount={product.images.length} />
            </div>
          </div>
        </div>

        {/* Section 4: ข้อมูลการขาย */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-primary">4. ข้อมูลการขาย</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">ราคา (บาท) <span className="text-red-500">*</span></label>
              <input type="number" name="price" defaultValue={product.price} className="w-full border rounded px-3 py-2" required min="0" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">จำนวนสต็อก (ชิ้น) <span className="text-red-500">*</span></label>
              <input type="number" name="stock" defaultValue={product.stock} className="w-full border rounded px-3 py-2" required min="0" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">ลิงก์สำหรับสั่งซื้อ (URL ภายนอก เช่น Shopee, LINE)</label>
              <input type="url" name="buyLink" defaultValue={product.buyLink || ''} className="w-full border rounded px-3 py-2" placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Section 5: การจัดส่ง */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-primary">5. การจัดส่ง</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">น้ำหนักของสินค้า</label>
              <input type="text" name="weight" defaultValue={product.weight || ''} list="weights" className="w-full border rounded px-3 py-2" placeholder="เช่น 0.1 KG" />
              <datalist id="weights">
                <option value="0.1 KG" />
                <option value="0.2 KG" />
                <option value="0.5 KG" />
                <option value="1.0 KG" />
                <option value="1.5 KG" />
                <option value="2.0 KG" />
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ขนาดกล่องส่งสินค้า (ยาว x กว้าง x สูง)</label>
              <input type="text" name="packageSize" defaultValue={product.packageSize || ''} list="packageSizes" className="w-full border rounded px-3 py-2" placeholder="เลือกหรือพิมพ์ขนาดพัสดุ" />
              <datalist id="packageSizes">
                <option value="กล่อง A (14 x 20 x 6 cm)" />
                <option value="กล่อง B (17 x 25 x 9 cm)" />
                <option value="กล่อง C (20 x 30 x 11 cm)" />
                <option value="กล่อง D (22 x 35 x 14 cm)" />
                <option value="ซองพลาสติก" />
              </datalist>
            </div>
          </div>
        </div>

        <div className="pt-2 pb-8">
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 shadow-md text-lg">
            อัปเดตข้อมูลสินค้า
          </button>
        </div>
      </ClientForm>
    </div>
  );
}
