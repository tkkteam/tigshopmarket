import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';

import prisma from '@/lib/prisma';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TigShop - Modern Marketplace',
  description: 'ซื้อขายสินค้าออนไลน์ครบวงจร',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setting = await prisma.setting.findFirst();

  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col bg-secondary text-foreground">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        
        <footer className="bg-white border-t py-8 mt-auto">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} TigShop Market. All rights reserved.</p>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">ติดตามเราบน:</span>
              <div className="flex items-center gap-3">
                {setting?.facebook && (
                  <Link href={setting.facebook} target="_blank" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition font-bold text-sm">
                    FB
                  </Link>
                )}
                {setting?.lineId && (
                  <Link href={setting.lineId.startsWith('http') ? setting.lineId : `https://line.me/ti/p/~${setting.lineId.replace('@', '')}`} target="_blank" className="w-10 h-10 rounded-full bg-[#00B900] text-white flex items-center justify-center hover:bg-[#009900] transition font-bold text-sm">
                    LINE
                  </Link>
                )}
                {setting?.youtube && (
                  <Link href={setting.youtube} target="_blank" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition font-bold text-sm">
                    YT
                  </Link>
                )}
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
