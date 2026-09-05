import Link from 'next/link';
import { ShoppingCart, Search, User } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          TigShop
        </Link>
        
        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
          <input 
            type="text" 
            placeholder="ค้นหาสินค้า..." 
            className="w-full py-2 px-4 rounded-sm text-foreground bg-white focus:outline-none"
          />
          <button className="absolute right-0 top-0 h-full px-4 bg-primary-hover rounded-r-sm transition-colors">
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link href="/cart" className="flex items-center hover:text-gray-200 transition-colors relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              0
            </span>
          </Link>
        </nav>
      </div>

      {/* Mobile Search Bar - Visible only on small screens */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <input 
            type="text" 
            placeholder="ค้นหาสินค้า..." 
            className="w-full py-2 px-4 rounded-sm text-foreground bg-white focus:outline-none"
          />
          <button className="absolute right-0 top-0 h-full px-4 bg-primary-hover rounded-r-sm">
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
