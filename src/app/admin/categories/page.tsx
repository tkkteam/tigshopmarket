import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { getShopeeCategories } from '@/actions/product';
import CategoryForm from '@/components/CategoryForm';

export const dynamic = 'force-dynamic';

export default async function CategoriesAdminPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const shopeeImages = await getShopeeCategories();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">จัดการหมวดหมู่สินค้า</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">เพิ่มหมวดหมู่ใหม่</h2>
        <CategoryForm actionType="add" predefinedImages={shopeeImages} />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">หมวดหมู่ทั้งหมด</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-sm text-gray-500">
              <th className="pb-3 font-medium w-20">รูปภาพ</th>
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
                  <td className="py-4 font-medium text-base min-w-[150px]">{category.name}</td>
                  <td className="py-4">
                    <CategoryForm actionType="update" category={category} predefinedImages={shopeeImages} />
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
