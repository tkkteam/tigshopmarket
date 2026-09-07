import { Package, Users } from 'lucide-react';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
const [productCount, customerCount] = await Promise.all([
    prisma.product.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } })
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ภาพรวมระบบ (Dashboard)</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">


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


    </div>
  );
}
