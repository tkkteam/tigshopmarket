import { Package, Users } from 'lucide-react';
import prisma from '@/lib/prisma';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [productCount, customerCount, products] = await Promise.all([
    prisma.product.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        category: true,
        images: {
          take: 1,
        },
      },
    })
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ภาพรวมระบบ (Dashboard)</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 lg:w-1/2">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-full">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">สินค้าในระบบ</p>
            <p className="text-2xl font-bold text-gray-800">{productCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">ลูกค้าทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-800">{customerCount}</p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4">สินค้าล่าสุด</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-sm text-gray-500">
              <th className="pb-3 font-medium w-16">รูปภาพ</th>
              <th className="pb-3 font-medium">ชื่อสินค้า</th>
              <th className="pb-3 font-medium">หมวดหมู่</th>
              <th className="pb-3 font-medium">ราคา</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  ยังไม่มีสินค้าในระบบ
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2">
                    <div className="w-12 h-12 relative bg-gray-100 rounded overflow-hidden">
                      {product.images[0]?.imageUrl ? (
                        <Image src={product.images[0].imageUrl} alt={product.name} fill className="object-cover" />
                      ) : (
                        <span className="text-xs text-gray-400 flex items-center justify-center h-full w-full">No img</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 font-medium">{product.name}</td>
                  <td className="py-4">{product.category.name}</td>
                  <td className="py-4">฿{product.price.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
