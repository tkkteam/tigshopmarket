'use client';

import { useState } from 'react';
import { Star, Share2, Heart, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { toggleLike } from '@/actions/like';
import { useTransition } from 'react';

export default function ProductClient({ product, initialIsLiked }: { product: any, initialIsLiked: boolean }) {
  const images = product.images?.length > 0 
    ? product.images.map((img: any) => img.imageUrl) 
    : ['https://via.placeholder.com/800?text=No+Image'];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleLike = () => {
    startTransition(async () => {
      await toggleLike(product.id, `/product/${product.id}`);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-8">
      {/* Left: Product Images */}
      <div className="w-full md:w-2/5 flex flex-col gap-4">
        <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden border border-gray-200">
          <Image src={selectedImage} alt={product.name} fill className="object-cover" />
        </div>
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img: string, idx: number) => (
              <button 
                key={idx} 
                onClick={() => setSelectedImage(img)}
                className={`relative aspect-square rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent hover:border-gray-300'} transition-all`}
              >
                <Image src={img} alt={`Thumbnail ${idx+1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Info */}
      <div className="w-full md:w-3/5 flex flex-col">
        <h1 className="text-2xl font-medium text-gray-900 leading-tight">
          {product.name}
        </h1>
        
        <div className="flex items-center gap-4 mt-3 text-sm">
          <div className="flex items-center text-primary">
            <span className="underline font-medium mr-1">5.0</span>
            <Star className="w-4 h-4 fill-primary text-primary" />
            <Star className="w-4 h-4 fill-primary text-primary" />
            <Star className="w-4 h-4 fill-primary text-primary" />
            <Star className="w-4 h-4 fill-primary text-primary" />
            <Star className="w-4 h-4 fill-primary text-primary" />
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="text-gray-600">
            ขายแล้ว <span className="text-gray-900 font-medium">0</span> ชิ้น
          </div>
        </div>

        <div className="bg-gray-50 p-4 mt-4 rounded-sm flex items-end gap-3 border border-gray-100">
          <span className="text-3xl font-bold text-primary">฿{product.price.toLocaleString()}</span>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-500 w-24">SKU</span>
            <span className="text-gray-800">{product.sku}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-500 w-24">หมวดหมู่</span>
            <Link href={`/category/${product.categoryId}`} className="text-primary hover:underline">
              {product.category?.name}
            </Link>
          </div>

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
            <span className="text-sm text-gray-500">มีสินค้าทั้งหมด {product.stock} ชิ้น</span>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          {product.buyLink ? (
            <Link 
              href={product.buyLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 max-w-[500px] flex justify-center items-center bg-primary text-white px-6 py-3 rounded-sm hover:bg-primary-hover transition-colors font-medium shadow-sm"
            >
              ซื้อสินค้า
            </Link>
          ) : (
            <button disabled className="flex-1 max-w-[500px] bg-gray-300 text-gray-500 px-6 py-3 rounded-sm font-medium shadow-sm cursor-not-allowed">
              สินค้าหมด / ยังไม่เปิดขาย
            </button>
          )}
        </div>

        <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100 text-gray-600 text-sm">
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <Share2 className="w-5 h-5" />
            แชร์
          </button>
          <button 
            onClick={handleLike} 
            disabled={isPending}
            className={`flex items-center gap-2 transition-colors ${initialIsLiked ? 'text-pink-500 hover:text-pink-600' : 'hover:text-pink-500'}`}
          >
            <Heart className={`w-5 h-5 ${initialIsLiked ? 'fill-pink-500' : ''}`} />
            {initialIsLiked ? 'ถูกใจแล้ว' : 'ถูกใจ'} ({product.likesCount || 0})
          </button>
        </div>
      </div>
    </div>
  );
}
