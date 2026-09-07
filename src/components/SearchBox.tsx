'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchProducts } from '@/actions/search';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SearchBox({ isMobile = false }: { isMobile?: boolean }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        const res = await searchProducts(query);
        setResults(res);
        setIsLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${isMobile ? 'w-full' : 'hidden md:flex flex-1 max-w-2xl mx-8'}`}>
      <form onSubmit={handleSearch} className="w-full relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim()) setIsOpen(true); }}
          placeholder="ค้นหาสินค้า, หมวดหมู่, หรือรหัสสินค้า..." 
          className="w-full py-2 px-4 rounded-sm text-foreground bg-white focus:outline-none"
        />
        <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-primary-hover rounded-r-sm transition-colors">
          <Search className="w-5 h-5 text-white" />
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (query.trim() !== '') && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 text-sm">กำลังค้นหา...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((item) => (
                <li key={item.id} className="border-b border-gray-50 last:border-b-0">
                  <Link 
                    href={`/product/${item.id}`} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.categoryName}</p>
                    </div>
                    <div className="text-primary font-bold text-sm shrink-0">
                      ฿{item.price.toLocaleString()}
                    </div>
                  </Link>
                </li>
              ))}
              <li>
                <button 
                  onClick={handleSearch}
                  className="w-full text-center p-3 text-sm text-primary hover:bg-gray-50 font-medium"
                >
                  ดูผลลัพธ์ทั้งหมดสำหรับ &quot;{query}&quot;
                </button>
              </li>
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">ไม่พบสินค้าที่คุณค้นหา</div>
          )}
        </div>
      )}
    </div>
  );
}
