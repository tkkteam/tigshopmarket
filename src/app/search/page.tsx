import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await props.searchParams;
  const query = q || '';

  const products = query ? await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
        { category: { name: { contains: query, mode: 'insensitive' } } }
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1
      },
      category: true
    }
  }) : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 py-2">
        <Link href="/" className="hover:text-primary">หน้าแรก</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-800">ค้นหา</span>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">
          ผลการค้นหาสำหรับ: "{query}"
        </h1>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="bg-white border border-gray-100 rounded-sm shadow-sm hover:-translate-y-1 hover:shadow-md transition-all group overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <Image 
                      src={product.images[0].imageUrl} 
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-gray-400">ไม่มีรูปภาพ</span>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <h3 className="text-sm text-gray-800 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500">{product.category?.name}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-primary font-semibold">฿{product.price.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">ไม่พบสินค้าที่ตรงกับการค้นหา "{query}"</p>
            <Link href="/" className="text-primary hover:underline">
              ← กลับไปเลือกซื้อสินค้าทั้งหมด
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
