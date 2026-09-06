import Link from 'next/link';
import { User } from 'lucide-react';
import SearchBox from '@/components/SearchBox';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          TigShop
        </Link>
        
        {/* Search Bar - Desktop */}
        <SearchBox />

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          {/* Cart removed */}
        </nav>
      </div>

      {/* Mobile Search Bar - Visible only on small screens */}
      <div className="md:hidden px-4 pb-3">
        <SearchBox isMobile={true} />
      </div>
    </header>
  );
}
