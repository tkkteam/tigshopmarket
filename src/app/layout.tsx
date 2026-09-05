import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'TigShop - Modern Marketplace',
  description: 'ซื้อขายสินค้าออนไลน์ครบวงจร',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col bg-secondary text-foreground">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        {/* We can add Footer here later */}
      </body>
    </html>
  );
}
