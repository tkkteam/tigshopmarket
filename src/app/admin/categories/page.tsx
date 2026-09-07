import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import ClientForm from '@/components/ClientForm';
import { addCategory, updateCategory } from '@/actions/product';

export const dynamic = 'force-dynamic';

export default async function CategoriesAdminPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">จัดการหมวดหมู่สินค้า</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">เพิ่มหมวดหมู่ใหม่</h2>
        <ClientForm action={addCategory} className="flex flex-col gap-3" successMessage="เพิ่มหมวดหมู่สำเร็จ!">
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" name="name" placeholder="ชื่อหมวดหมู่ใหม่" className="border rounded px-3 py-2 flex-1" required />
            <input type="file" name="image" accept="image/*" className="border rounded px-3 py-1.5 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 whitespace-nowrap">เพิ่มหมวดหมู่</button>
          </div>
        </ClientForm>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">หมวดหมู่ทั้งหมด</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-sm text-gray-500">
              <th className="pb-3 font-medium">รูปภาพ</th>
              <th className="pb-3 font-medium">ชื่อหมวดหมู่</th>
              <th className="pb-3 font-medium">เปลี่ยนชื่อ/รูปภาพ</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-500">
                  ยังไม่มีหมวดหมู่ในระบบ
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2">
                    <div className="w-16 h-16 relative bg-gray-100 rounded overflow-hidden border">
                      {category.imageUrl ? (
                        <Image src={category.imageUrl} alt={category.name} fill className="object-cover" />
                      ) : (
                        <span className="text-xs text-gray-400 absolute inset-0 flex items-center justify-center">ไม่มีรูป</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 font-medium text-base">{category.name}</td>
                  <td className="py-4">
                    <ClientForm action={updateCategory} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center" successMessage="อัปเดตหมวดหมู่สำเร็จ!">
                      <input type="hidden" name="id" value={category.id} />
                      <input type="text" name="name" defaultValue={category.name} className="border rounded px-2 py-1 w-full sm:w-48 text-sm" required />
                      <input type="file" name="image" accept="image/*" className="border rounded px-2 py-1 text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-100 w-full sm:w-auto" />
                      <button type="submit" className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 whitespace-nowrap">
                        บันทึกการแก้ไข
                      </button>
                    </ClientForm>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
