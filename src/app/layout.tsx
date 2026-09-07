import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from 'react-hot-toast';

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
        <Toaster position="bottom-right" />
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
                  <Link href={setting.facebook} target="_blank" className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166FE5] transition shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Link>
                )}
                {setting?.lineId && (
                  <Link href={setting.lineId.startsWith('http') ? setting.lineId : `https://line.me/ti/p/~${setting.lineId.replace('@', '')}`} target="_blank" className="w-10 h-10 rounded-full bg-[#00C300] text-white flex items-center justify-center hover:bg-[#00B300] transition shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.938 8.878 9.324 9.613.391.083.923.258 1.058.59.12.296.082.756.039 1.066l-.172 1.036c-.053.33-.245 1.189 1.042.646 1.286-.543 6.945-4.095 9.429-6.969 2.148-2.483 3.28-4.526 3.28-5.982zm-15.011 2.378H6.554a.798.798 0 0 1-.798-.797V7.086c0-.441.356-.797.798-.797h2.435c.441 0 .798.356.798.797v3.996h1.637c.441 0 .798.356.798.798 0 .441-.357.798-.798.798h-2.435zm3.834 0h-1.597a.798.798 0 0 1-.798-.797V7.086c0-.441.356-.797.798-.797h1.597c.441 0 .798.356.798.797v4.799c0 .441-.357.797-.798.797zm6.059 0h-1.595l-2.029-2.736v2.736a.798.798 0 0 1-.798.797h-1.595a.798.798 0 0 1-.798-.797V7.086c0-.441.356-.797.798-.797h1.595l2.028 2.736V7.086c0-.441.356-.797.798-.797h1.595c.441 0 .798.356.798.797v4.799c0 .441-.357.797-.798.797z"/>
                    </svg>
                  </Link>
                )}
                {setting?.youtube && (
                  <Link href={setting.youtube} target="_blank" className="w-10 h-10 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:bg-[#E60000] transition shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .501 6.186C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
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
