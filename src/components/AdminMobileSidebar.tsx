'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, LayoutDashboard, LogOut, Key, Settings, Grid, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminMobileSidebar({ logoutAction }: { logoutAction: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-20">
        <h2 className="text-lg font-bold text-primary">TigShop Admin</h2>
        <button onClick={toggleMenu} className="p-1">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-10 flex mt-[60px]">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 mt-[60px]" onClick={closeMenu}></div>
          
          <aside className="relative w-64 bg-gray-900 text-white flex flex-col h-full overflow-y-auto">
            <nav className="flex-1 py-4">
              <ul className="space-y-1">
                <li>
                  <Link href="/admin" onClick={closeMenu} className={`flex items-center gap-3 px-6 py-3 transition-colors ${pathname === '/admin' ? 'text-white bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}>
                    <LayoutDashboard className="w-5 h-5" />
                    <span>ภาพรวม (Dashboard)</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/products" onClick={closeMenu} className={`flex items-center gap-3 px-6 py-3 transition-colors ${pathname === '/admin/products' ? 'text-white bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}>
                    <Package className="w-5 h-5" />
                    <span>จัดการสินค้า</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/categories" onClick={closeMenu} className={`flex items-center gap-3 px-6 py-3 transition-colors ${pathname === '/admin/categories' ? 'text-white bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}>
                    <Grid className="w-5 h-5" />
                    <span>จัดการหมวดหมู่</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/change-password" onClick={closeMenu} className={`flex items-center gap-3 px-6 py-3 transition-colors ${pathname === '/admin/change-password' ? 'text-white bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}>
                    <Key className="w-5 h-5" />
                    <span>เปลี่ยนรหัสผ่าน</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/settings" onClick={closeMenu} className={`flex items-center gap-3 px-6 py-3 transition-colors ${pathname === '/admin/settings' ? 'text-white bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}>
                    <Settings className="w-5 h-5" />
                    <span>ตั้งค่าโซเชียลมีเดีย</span>
                  </Link>
                </li>
              </ul>
            </nav>
            
            <div className="p-4 border-t border-gray-800">
              <form action={logoutAction}>
                <button type="submit" className="flex items-center gap-2 text-gray-400 hover:text-white w-full px-4 py-2 text-left">
                  <LogOut className="w-5 h-5" />
                  ออกจากระบบ
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
