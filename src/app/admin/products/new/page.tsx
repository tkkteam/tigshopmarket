import prisma from '@/lib/prisma';
import { addProduct, addCategory } from '@/actions/product';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-gray-500 hover:text-gray-800">
          ← กลับ
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">เพิ่มสินค้าใหม่</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="font-bold mb-4">หมวดหมู่</h2>
        <form action={async (formData) => {
          'use server';
          const name = formData.get('name') as string;
          if (name) await addCategory(name);
        }} className="flex gap-2">
          <input type="text" name="name" placeholder="ชื่อหมวดหมู่ใหม่" className="border rounded px-3 py-2 flex-1" required />
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">เพิ่มหมวดหมู่</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form action={addProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ชื่อสินค้า</label>
            <input type="text" name="name" className="w-full border rounded px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ราคา (บาท)</label>
            <input type="number" name="price" className="w-full border rounded px-3 py-2" required min="0" step="0.01" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">จำนวนสต็อก (ชิ้น)</label>
            <input type="number" name="stock" className="w-full border rounded px-3 py-2" required min="0" defaultValue="100" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ขนาดพัสดุ (เช่น กล่อง A, 20x30x10 cm)</label>
            <input type="text" name="packageSize" className="w-full border rounded px-3 py-2" placeholder="กรอกขนาดพัสดุ" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ลิงก์สำหรับสั่งซื้อ (URL ภายนอก เช่น Shopee, LINE)</label>
            <input type="url" name="buyLink" className="w-full border rounded px-3 py-2" placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">หมวดหมู่</label>
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

          <div>
            <label className="block text-sm font-medium mb-1">รายละเอียด</label>
            <textarea name="description" className="w-full border rounded px-3 py-2" rows={4}></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">รูปภาพสินค้า (สูงสุด 6 ภาพ)</label>
            <input type="file" name="images" accept="image/*" multiple max="6" className="w-full border rounded px-3 py-2" />
            <p className="text-xs text-gray-500 mt-1">สามารถเลือกได้หลายไฟล์พร้อมกัน</p>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark">
              บันทึกสินค้า
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
