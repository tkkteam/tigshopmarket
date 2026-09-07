import prisma from '@/lib/prisma';
import { addProduct, getShopeeCategories } from '@/actions/product';
import Link from 'next/link';
import ImageUploadBox from '@/components/ImageUploadBox';
import ClientForm from '@/components/ClientForm';
import CategoryForm from '@/components/CategoryForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const shopeeImages = await getShopeeCategories();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-gray-500 hover:text-gray-800">
          ← กลับ
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">เพิ่มสินค้าใหม่</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">เพิ่มหมวดหมู่ใหม่</h2>
        <CategoryForm actionType="add" predefinedImages={shopeeImages} />
      </div>

      <ClientForm action={addProduct} className="space-y-6" successMessage="เพิ่มสินค้าใหม่เรียบร้อยแล้ว!">
        
        {/* Section 1: ข้อมูลทั่วไป */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-primary">1. ข้อมูลทั่วไป</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">ชื่อสินค้า <span className="text-red-500">*</span></label>
              <input type="text" name="name" className="w-full border rounded px-3 py-2" required placeholder="เช่น เสื้อยืดแขนสั้นลายทาง" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">หมวดหมู่ <span className="text-red-500">*</span></label>
              <select name="categoryId" className="w-full border rounded px-3 py-2" required>
                <option value="">-- เลือกหมวดหมู่ --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-sm text-red-500 mt-1">กรุณาเพิ่มหมวดหมู่ด้านบนก่อน</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: คุณลักษณะของสินค้า */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-primary">2. คุณลักษณะของสินค้า</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">แบรนด์</label>
              <input type="text" name="brand" list="brands" className="w-full border rounded px-3 py-2" placeholder="เลือกหรือพิมพ์แบรนด์ใหม่" defaultValue="No Brand" />
              <datalist id="brands">
                <option value="No Brand" />
                <option value="TIG" />
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">สภาพสินค้า</label>
              <select name="condition" className="w-full border rounded px-3 py-2">
                <option value="ของใหม่">ของใหม่</option>
                <option value="มือ 2">มือ 2</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ระยะเวลาการรับประกัน</label>
              <select name="warranty" className="w-full border rounded px-3 py-2">
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
              <textarea name="description" className="w-full border rounded px-3 py-2" rows={5} placeholder="ใส่รายละเอียดสินค้าของคุณ..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 border-b pb-2">รูปภาพสินค้า</label>
              <ImageUploadBox maxImages={9} />
            </div>
          </div>
        </div>

        {/* Section 4: ข้อมูลการขาย */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-primary">4. ข้อมูลการขาย</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">ราคา (บาท) <span className="text-red-500">*</span></label>
              <input type="number" name="price" className="w-full border rounded px-3 py-2" required min="0" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">จำนวนสต็อก (ชิ้น) <span className="text-red-500">*</span></label>
              <input type="number" name="stock" className="w-full border rounded px-3 py-2" required min="0" defaultValue="100" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">ลิงก์สำหรับสั่งซื้อ (URL ภายนอก เช่น Shopee, LINE)</label>
              <input type="url" name="buyLink" className="w-full border rounded px-3 py-2" placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Section 5: การจัดส่ง */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-primary">5. การจัดส่ง</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">น้ำหนักของสินค้า</label>
              <input type="text" name="weight" list="weights" className="w-full border rounded px-3 py-2" placeholder="เช่น 0.1 KG" />
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
              <input type="text" name="packageSize" list="packageSizes" className="w-full border rounded px-3 py-2" placeholder="เลือกหรือพิมพ์ขนาดพัสดุ" />
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
            บันทึกสินค้าใหม่
          </button>
        </div>
      </ClientForm>
    </div>
  );
}
