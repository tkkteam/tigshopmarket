'use client';

import { useState } from 'react';
import { ShoppingCart, Star, Share2, Heart, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

// Mock Data (ในระบบจริงจะดึงข้อมูลจาก Database ผ่าน API หรือ Server Component)
const mockProduct = {
  id: '1',
  sku: 'PRD-001',
  name: 'หน้าจอคอมพิวเตอร์ 24 นิ้ว IPS Full HD - ถนอมสายตา สีสันคมชัด ขอบจอบางพิเศษ',
  price: 3290.00,
  originalPrice: 4500.00,
  stock: 45,
  category: 'อุปกรณ์คอมพิวเตอร์',
  rating: 4.8,
  sold: 124,
  description: `นี่คือคำอธิบายสินค้าแบบละเอียด

คุณสมบัติเด่น:
- หน้าจอขนาด 24 นิ้ว ความละเอียด Full HD (1920x1080)
- พาเนล IPS ให้สีสันที่แม่นยำและมุมมองกว้าง 178 องศา
- เทคโนโลยีถนอมสายตา ลดแสงสีฟ้าและลดการกะพริบของหน้าจอ
- ขอบจอบางพิเศษ (Ultra-slim bezels) เหมาะสำหรับการต่อหลายจอ
- พอร์ตเชื่อมต่อครบครัน HDMI, DisplayPort, VGA
- รับประกันศูนย์ 3 ปีเต็ม บริการซ่อมถึงบ้าน

ข้อควรระวัง: ไม่ควรติดตั้งใกล้บริเวณที่มีความชื้นสูง`,
  images: [
    'https://picsum.photos/seed/mon1/800/800',
    'https://picsum.photos/seed/mon2/800/800',
    'https://picsum.photos/seed/mon3/800/800',
    'https://picsum.photos/seed/mon4/800/800',
  ]
};

const relatedProducts = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 10,
  name: `สินค้าที่เกี่ยวข้อง ${i + 1}`,
  price: (Math.random() * 2000 + 100).toFixed(2),
  sold: Math.floor(Math.random() * 200),
  image: `https://picsum.photos/seed/rel${i}/400/400`,
}));

export default function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params); // Unwrap params in Next.js 15
  const [selectedImage, setSelectedImage] = useState(mockProduct.images[0]);
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (quantity < mockProduct.stock) setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 py-2">
        <Link href="/" className="hover:text-primary">หน้าแรก</Link>
        <span className="mx-2">&gt;</span>
        <Link href={`/category/1`} className="hover:text-primary">{mockProduct.category}</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-800">{mockProduct.name}</span>
      </div>

      {/* Product Main Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-8">
        
        {/* Left: Product Images */}
        <div className="w-full md:w-2/5 flex flex-col gap-4">
          <div className="aspect-square bg-gray-100 rounded-md overflow-hidden border border-gray-200">
            <img src={selectedImage} alt={mockProduct.name} className="w-full h-full object-cover" />
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {mockProduct.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setSelectedImage(img)}
                className={`aspect-square rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent hover:border-gray-300'} transition-all`}
              >
                <img src={img} alt={`Thumbnail ${idx+1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="w-full md:w-3/5 flex flex-col">
          <h1 className="text-2xl font-medium text-gray-900 leading-tight">
            {mockProduct.name}
          </h1>
          
          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center text-primary">
              <span className="underline font-medium mr-1">{mockProduct.rating}</span>
              <Star className="w-4 h-4 fill-primary text-primary" />
              <Star className="w-4 h-4 fill-primary text-primary" />
              <Star className="w-4 h-4 fill-primary text-primary" />
              <Star className="w-4 h-4 fill-primary text-primary" />
              <Star className="w-4 h-4 fill-primary text-primary" />
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="text-gray-600">
              ขายแล้ว <span className="text-gray-900 font-medium">{mockProduct.sold}</span> ชิ้น
            </div>
          </div>

          <div className="bg-gray-50 p-4 mt-4 rounded-sm flex items-end gap-3 border border-gray-100">
            <span className="text-gray-400 line-through text-lg">฿{mockProduct.originalPrice.toLocaleString()}</span>
            <span className="text-3xl font-bold text-primary">฿{mockProduct.price.toLocaleString()}</span>
          </div>

          <div className="mt-8 space-y-6">
            {/* Properties */}
            <div className="flex items-center gap-4">
              <span className="text-gray-500 w-24">SKU</span>
              <span className="text-gray-800">{mockProduct.sku}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-500 w-24">หมวดหมู่</span>
              <span className="text-gray-800">{mockProduct.category}</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-gray-500 w-24">จำนวน</span>
              <div className="flex items-center border border-gray-300 rounded-sm">
                <button onClick={decreaseQuantity} className="p-2 text-gray-600 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className="w-12 text-center border-l border-r border-gray-300 h-full py-1 text-gray-800 outline-none"
                />
                <button onClick={increaseQuantity} className="p-2 text-gray-600 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
              </div>
              <span className="text-sm text-gray-500">มีสินค้าทั้งหมด {mockProduct.stock} ชิ้น</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button className="flex-1 max-w-[250px] flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary px-6 py-3 rounded-sm hover:bg-primary/20 transition-colors font-medium">
              <ShoppingCart className="w-5 h-5" />
              เพิ่มไปยังรถเข็น
            </button>
            <button className="flex-1 max-w-[250px] bg-primary text-white px-6 py-3 rounded-sm hover:bg-primary-hover transition-colors font-medium shadow-sm">
              ซื้อสินค้า
            </button>
          </div>

          {/* Share & Like */}
          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100 text-gray-600 text-sm">
            <button className="flex items-center gap-2 hover:text-primary transition-colors">
              <Share2 className="w-5 h-5" />
              แชร์
            </button>
            <button className="flex items-center gap-2 hover:text-primary transition-colors">
              <Heart className="w-5 h-5" />
              ถูกใจ (12)
            </button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <div className="bg-gray-50 p-3 rounded-sm mb-4 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 uppercase">รายละเอียดสินค้า</h2>
        </div>
        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed px-4">
          {mockProduct.description}
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-500 uppercase mb-4">สินค้าอื่นๆ ที่คุณอาจสนใจ</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          {relatedProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-sm shadow-sm hover:-translate-y-1 hover:shadow-md transition-all group overflow-hidden border border-transparent hover:border-primary">
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
                  <span className="text-xs text-gray-500">ขายแล้ว {product.sold}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
