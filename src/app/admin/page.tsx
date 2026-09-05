import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
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
            <p className="text-2xl font-bold text-gray-800">฿145,200</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-full">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">คำสั่งซื้อทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-800">324</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-full">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">สินค้าในระบบ</p>
            <p className="text-2xl font-bold text-gray-800">86</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-full">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">ลูกค้าทั้งหมด</p>
            <p className="text-2xl font-bold text-gray-800">1,204</p>
          </div>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">คำสั่งซื้อล่าสุด</h2>
          <button className="text-sm text-primary hover:underline">ดูทั้งหมด</button>
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
              {[
                { id: 'ORD-00324', customer: 'สมชาย ใจดี', date: '05 ก.ย. 2026', total: 3290.00, status: 'รอชำระเงิน', color: 'bg-yellow-100 text-yellow-700' },
                { id: 'ORD-00323', customer: 'วิภา รักสวย', date: '05 ก.ย. 2026', total: 450.00, status: 'กำลังจัดเตรียม', color: 'bg-blue-100 text-blue-700' },
                { id: 'ORD-00322', customer: 'เอกพล ทองมาก', date: '04 ก.ย. 2026', total: 12500.00, status: 'จัดส่งแล้ว', color: 'bg-purple-100 text-purple-700' },
                { id: 'ORD-00321', customer: 'นรี วงศ์สุวรรณ', date: '03 ก.ย. 2026', total: 790.00, status: 'เสร็จสิ้น', color: 'bg-green-100 text-green-700' },
              ].map((order, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 text-primary font-medium">{order.id}</td>
                  <td className="py-4">{order.customer}</td>
                  <td className="py-4">{order.date}</td>
                  <td className="py-4 font-medium">฿{order.total.toLocaleString()}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.color}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
