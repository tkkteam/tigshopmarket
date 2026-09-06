import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [productCount, orderCount, customerCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    })
  ]);

  const totalSales = orders
    .filter(o => o.status === 'COMPLETED' || o.status === 'PAID')
    .reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ภาพรวมระบบ (Dashboard)</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">ยอดขายรวม</p>
            <p className="text-2xl font-bold text-gray-800">฿{totalSales.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-full">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">คำสั่งซื้อทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-800">{orderCount}</p>
          </div>
        </div>

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

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">คำสั่งซื้อล่าสุด</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="pb-3 font-medium">รหัสคำสั่งซื้อ</th>
                <th className="pb-3 font-medium">ลูกค้า</th>
                <th className="pb-3 font-medium">วันที่</th>
                <th className="pb-3 font-medium">ยอดรวม</th>
                <th className="pb-3 font-medium">สถานะ</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    ยังไม่มีคำสั่งซื้อในระบบ
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  let color = 'bg-gray-100 text-gray-700';
                  if (order.status === 'PENDING') color = 'bg-yellow-100 text-yellow-700';
                  if (order.status === 'PREPARING') color = 'bg-blue-100 text-blue-700';
                  if (order.status === 'SHIPPED') color = 'bg-purple-100 text-purple-700';
                  if (order.status === 'COMPLETED') color = 'bg-green-100 text-green-700';
                  
                  return (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 text-primary font-medium">{order.id.slice(0, 8)}...</td>
                      <td className="py-4">{order.user.name}</td>
                      <td className="py-4">{order.createdAt.toLocaleDateString('th-TH')}</td>
                      <td className="py-4 font-medium">฿{order.totalPrice.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
