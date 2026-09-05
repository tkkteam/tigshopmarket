'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

// Mock Data
const initialCart = [
  {
    id: 1,
    productId: '101',
    name: 'หน้าจอคอมพิวเตอร์ 24 นิ้ว IPS Full HD - ถนอมสายตา สีสันคมชัด ขอบจอบางพิเศษ',
    image: 'https://picsum.photos/seed/mon1/200/200',
    price: 3290.00,
    quantity: 1,
    stock: 45
  },
  {
    id: 2,
    productId: '102',
    name: 'เมาส์ไร้สายบลูทูธ เสียงเงียบ ดีไซน์มินิมอล',
    image: 'https://picsum.photos/seed/mouse/200/200',
    price: 450.00,
    quantity: 2,
    stock: 120
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCart);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > 0 && newQty <= item.stock) {
          return { ...item, quantity: newQty };
        }
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + shippingFee;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <h1 className="text-2xl font-medium text-gray-800 mb-6 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-primary" />
        ตะกร้าสินค้า
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm p-12 flex flex-col items-center justify-center text-gray-500">
          <ShoppingBag className="w-24 h-24 text-gray-200 mb-4" />
          <p className="text-lg">ไม่มีสินค้าในตะกร้าของคุณ</p>
          <Link href="/" className="mt-6 bg-primary text-white px-8 py-2 rounded-sm hover:bg-primary-hover">
            ไปเลือกซื้อสินค้ากันเลย
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 space-y-4">
            {/* Header Row */}
            <div className="bg-white p-4 rounded-sm shadow-sm hidden md:flex text-gray-500 text-sm font-medium">
              <div className="w-2/5">สินค้า</div>
              <div className="w-1/5 text-center">ราคาต่อชิ้น</div>
              <div className="w-1/5 text-center">จำนวน</div>
              <div className="w-1/5 text-right pr-4">แอคชั่น</div>
            </div>

            {/* Items */}
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-sm shadow-sm flex flex-col md:flex-row items-center gap-4">
                {/* Product Info */}
                <div className="w-full md:w-2/5 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <Link href={`/product/${item.productId}`} className="text-gray-800 hover:text-primary line-clamp-2 text-sm leading-tight">
                    {item.name}
                  </Link>
                </div>
                
                {/* Price */}
                <div className="w-full md:w-1/5 text-left md:text-center text-gray-600 font-medium">
                  <span className="md:hidden text-gray-400 text-sm mr-2">ราคา:</span>
                  ฿{item.price.toLocaleString()}
                </div>

                {/* Quantity */}
                <div className="w-full md:w-1/5 flex justify-start md:justify-center">
                  <div className="flex items-center border border-gray-300 rounded-sm">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 px-2 text-gray-600 hover:bg-gray-100"><Minus className="w-3 h-3" /></button>
                    <input 
                      type="text" 
                      value={item.quantity} 
                      readOnly 
                      className="w-10 text-center border-l border-r border-gray-300 h-full py-1 text-sm text-gray-800 outline-none"
                    />
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 px-2 text-gray-600 hover:bg-gray-100"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full md:w-1/5 text-right flex justify-between md:justify-end items-center pr-2">
                  <span className="md:hidden font-bold text-primary">฿{(item.price * item.quantity).toLocaleString()}</span>
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-sm shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-4">สรุปคำสั่งซื้อ</h2>
              
              <div className="space-y-3 text-gray-600 text-sm">
                <div className="flex justify-between">
                  <span>ยอดรวมสินค้า ({cartItems.length} ชิ้น)</span>
                  <span>฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span>฿{shippingFee.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="border-t mt-4 pt-4 flex justify-between items-end">
                <span className="text-gray-800 font-medium">ยอดสุทธิ</span>
                <span className="text-2xl font-bold text-primary">฿{total.toLocaleString()}</span>
              </div>
              
              <button className="w-full bg-primary text-white py-3 mt-6 rounded-sm hover:bg-primary-hover font-medium transition-colors">
                ดำเนินการชำระเงิน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
