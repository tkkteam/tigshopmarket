import Link from 'next/link';

// Mock Data for UI Preview
const categories = [
  { id: 1, name: 'อุปกรณ์คอมพิวเตอร์', icon: '💻' },
  { id: 2, name: 'โทรศัพท์มือถือ', icon: '📱' },
  { id: 3, name: 'เครื่องใช้ไฟฟ้า', icon: '📺' },
  { id: 4, name: 'แฟชั่น', icon: '👕' },
  { id: 5, name: 'ของตกแต่งบ้าน', icon: '🏠' },
  { id: 6, name: 'กล้อง', icon: '📷' },
];

const mockProducts = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `สินค้าตัวอย่างที่ ${i + 1} - คุณภาพสูง ใช้งานได้ดีเยี่ยม เหมาะกับทุกคน`,
  price: (Math.random() * 5000 + 100).toFixed(2),
  sold: Math.floor(Math.random() * 500),
  image: `https://picsum.photos/seed/${i + 1}/400/400`,
}));

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Banner Section */}
      <section className="w-full bg-white rounded-lg shadow-sm overflow-hidden flex h-64 md:h-80 items-center justify-center">
         <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-400">[ Banner Slider Area ]</h2>
            <p className="text-gray-400 mt-2">พื้นที่สำหรับใส่รูปแบนเนอร์โปรโมชั่น</p>
         </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase">หมวดหมู่สินค้า</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.id}`} className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
              <span className="text-4xl mb-2">{cat.icon}</span>
              <span className="text-sm text-gray-700 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between bg-white p-4 rounded-t-lg border-b-2 border-primary">
          <h2 className="text-lg font-bold text-primary uppercase">สินค้าแนะนำ</h2>
          <Link href="/products" className="text-sm text-gray-500 hover:text-primary">ดูทั้งหมด &gt;</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
          {mockProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-sm shadow-sm hover:-translate-y-1 hover:shadow-md transition-all group overflow-hidden">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 flex flex-col gap-2">
                <h3 className="text-sm text-gray-800 line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-primary font-semibold">฿{product.price}</span>
                  <span className="text-xs text-gray-500">ขายแล้ว {product.sold} ชิ้น</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <button className="bg-white border border-gray-300 text-gray-700 px-8 py-2 rounded-sm hover:bg-gray-50 transition-colors w-full max-w-sm">
          โหลดสินค้าเพิ่มเติม
        </button>
      </div>
    </div>
  );
}
