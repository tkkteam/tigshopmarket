import Link from 'next/link';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { deleteProduct, clearMockData } from '@/actions/product';

export const dynamic = 'force-dynamic';

export default async function ProductsAdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      images: {
        take: 1,
      },
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">จัดการสินค้า</h1>
        <div className="flex gap-2">
          <form action={clearMockData}>
            <button type="submit" className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-200">
              ล้างข้อมูลทั้งหมด
            </button>
          </form>
          <Link href="/admin/products/new" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark">
            + เพิ่มสินค้า
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-sm text-gray-500">
              <th className="pb-3 font-medium">รูปภาพ</th>
              <th className="pb-3 font-medium">ชื่อสินค้า</th>
              <th className="pb-3 font-medium">หมวดหมู่</th>
              <th className="pb-3 font-medium">ราคา</th>
              <th className="pb-3 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  ยังไม่มีสินค้าในระบบ
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2">
                    <div className="w-12 h-12 relative bg-gray-100 rounded overflow-hidden">
                      {product.images[0]?.imageUrl && (
                        <Image src={product.images[0].imageUrl} alt={product.name} fill className="object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 font-medium">{product.name}</td>
                  <td className="py-4">{product.category.name}</td>
                  <td className="py-4">฿{product.price.toLocaleString()}</td>
                  <td className="py-4">
                    <div className="flex gap-3 items-center">
                      <Link href={`/admin/products/${product.id}/edit`} className="text-blue-500 hover:underline">
                        แก้ไข
                      </Link>
                      <form action={async () => {
                        'use server';
                        await deleteProduct(product.id);
                      }}>
                        <button type="submit" className="text-red-500 hover:underline">
                          ลบ
                        </button>
                      </form>
                    </div>
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
