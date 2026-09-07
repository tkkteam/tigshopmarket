import Link from 'next/link';
import prisma from '@/lib/prisma';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let categories: { id: string; name: string; products?: { images: { imageUrl: string }[] }[] }[] = [];
  let products: { id: string; name: string; price: number; images?: { imageUrl: string }[] }[] = [];
  let errorMsg = "";

  try {
    categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      take: 12,
      include: {
        products: {
          take: 1,
          include: {
            images: { take: 1, orderBy: { sortOrder: 'asc' } }
          }
        }
      }
    });

    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
    });
  } catch (e: unknown) {
    if (e && typeof e === 'object') {
      errorMsg = JSON.stringify(e, Object.getOwnPropertyNames(e));
    } else {
      errorMsg = String(e);
    }
  }

  return (
    <div className="space-y-8">
      {errorMsg && (
        <div className="bg-red-100 p-4 rounded text-red-700">
          <strong>Database Error:</strong>
          <pre className="text-xs whitespace-pre-wrap">{errorMsg}</pre>
        </div>
      )}
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
        {categories.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const catImage = cat.products?.[0]?.images?.[0]?.imageUrl;
              return (
              <Link key={cat.id} href={`/category/${cat.id}`} className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow group">
                {catImage ? (
                  <div className="relative w-16 h-16 mb-2 rounded-full overflow-hidden border border-gray-200 group-hover:scale-105 transition-transform">
                    <Image src={catImage} alt={cat.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 mb-2 rounded-full bg-gray-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">📁</div>
                )}
                <span className="text-sm text-gray-700 text-center line-clamp-1">{cat.name}</span>
              </Link>
            )})}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">ยังไม่มีหมวดหมู่สินค้าในระบบ</p>
        )}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between bg-white p-4 rounded-t-lg border-b-2 border-primary">
          <h2 className="text-lg font-bold text-primary uppercase">สินค้าแนะนำ</h2>
          <Link href="/products" className="text-sm text-gray-500 hover:text-primary">ดูทั้งหมด &gt;</Link>
        </div>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-sm shadow-sm hover:-translate-y-1 hover:shadow-md transition-all group overflow-hidden">
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
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-primary font-semibold">฿{product.price.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 text-center rounded-b-lg">
            <p className="text-sm text-gray-500">ยังไม่มีสินค้าในระบบ</p>
          </div>
        )}
      </section>

      {/* Load More Button */}
      {products.length >= 20 && (
        <div className="flex justify-center mt-8">
          <button className="bg-white border border-gray-300 text-gray-700 px-8 py-2 rounded-sm hover:bg-gray-50 transition-colors w-full max-w-sm">
            โหลดสินค้าเพิ่มเติม
          </button>
        </div>
      )}
    </div>
  );
}
