import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Fetch some related products in same category (up to 5)
  const relatedProducts = await prisma.product.findMany({
    where: { 
      categoryId: product.categoryId,
      id: { not: product.id }
    },
    take: 5,
    include: {
      images: { take: 1 }
    }
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 py-2">
        <Link href="/" className="hover:text-primary">หน้าแรก</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-800">{product.category.name}</span>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      {/* Product Main Section (Client Component for interactivity) */}
      <ProductClient product={product} />

      {/* Description Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <div className="bg-gray-50 p-3 rounded-sm mb-4 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 uppercase">รายละเอียดสินค้า</h2>
        </div>
        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed px-4">
          {product.description || 'ไม่มีรายละเอียดสินค้า'}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-500 uppercase mb-4">สินค้าอื่นๆ ที่คุณอาจสนใจ</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
            {relatedProducts.map((relProduct) => (
              <Link key={relProduct.id} href={`/product/${relProduct.id}`} className="bg-white rounded-sm shadow-sm hover:-translate-y-1 hover:shadow-md transition-all group overflow-hidden border border-transparent hover:border-primary">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={relProduct.images[0]?.imageUrl || 'https://via.placeholder.com/400?text=No+Image'} 
                    alt={relProduct.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <h3 className="text-sm text-gray-800 line-clamp-2 leading-tight">
                    {relProduct.name}
                  </h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-primary font-semibold">฿{relProduct.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">ขายแล้ว 0</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
