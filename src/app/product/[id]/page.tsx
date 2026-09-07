import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import ProductClient from './ProductClient';

export const dynamic = 'force-dynamic';

async function getIpAddress(headersList: Headers) {
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  const realIp = headersList.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown-ip';
}

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

  const headersList = await headers();
  const ipAddress = await getIpAddress(headersList);
  
  const existingLike = await prisma.productLike.findUnique({
    where: {
      productId_ipAddress: {
        productId: id,
        ipAddress
      }
    }
  });

  const isLiked = !!existingLike;

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
        <Link href={`/category/${product.categoryId}`} className="hover:text-primary">{product.category.name}</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      {/* Product Main Section (Client Component for interactivity) */}
      <ProductClient product={product} initialIsLiked={isLiked} />

      {/* Attributes & Description Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <div className="bg-gray-50 p-3 rounded-sm mb-4 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 uppercase">ข้อมูลจำเพาะของสินค้า</h2>
        </div>
        <div className="px-4 mb-8">
          <table className="w-full max-w-2xl text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500 w-1/3">หมวดหมู่</td>
                <td className="py-3 text-gray-800"><Link href={`/category/${product.categoryId}`} className="text-blue-600 hover:underline">{product.category.name}</Link></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500">แบรนด์</td>
                <td className="py-3 text-gray-800">{product.brand || 'No Brand'}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500">สภาพสินค้า</td>
                <td className="py-3 text-gray-800">{product.condition || 'ของใหม่'}</td>
              </tr>
              {product.weight && (
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500">น้ำหนัก</td>
                <td className="py-3 text-gray-800">{product.weight}</td>
              </tr>
              )}
              {product.packageSize && (
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500">ขนาดพัสดุ</td>
                <td className="py-3 text-gray-800">{product.packageSize}</td>
              </tr>
              )}
              <tr className="border-b border-gray-100">
                <td className="py-3 text-gray-500">การรับประกัน</td>
                <td className="py-3 text-gray-800">{product.warranty || 'ไม่มีประกัน'}</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500">จำนวนสต็อก</td>
                <td className="py-3 text-gray-800">{product.stock} ชิ้น</td>
              </tr>
            </tbody>
          </table>
        </div>

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
                  <Image 
                    src={relProduct.images[0]?.imageUrl || 'https://via.placeholder.com/400?text=No+Image'} 
                    alt={relProduct.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
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
