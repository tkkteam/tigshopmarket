import Link from 'next/link';
import { Package, LayoutDashboard, LogOut, Key, Settings, Grid } from 'lucide-react';
import ClientForm from '@/components/ClientForm';
import AdminMobileSidebar from '@/components/AdminMobileSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  async function handleLogout() {
    'use server';
    const { cookies } = await import('next/headers');
    const { redirect } = await import('next/navigation');
    const cookieStore = await cookies();
    cookieStore.delete('admin_token');
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 mt-[-2rem]"> {/* offset standard layout padding */}
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col shadow-xl hidden md:flex">
        <div className="p-6 text-center border-b border-gray-800">
          <h2 className="text-2xl font-bold text-primary">TigShop Admin</h2>
          <p className="text-xs text-gray-400 mt-1">Management Dashboard</p>
        </div>
        
        <nav className="flex-1 py-6">
          <ul className="space-y-1">
            <li>
              <Link href="/admin" className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                <LayoutDashboard className="w-5 h-5" />
                <span>ภาพรวม (Dashboard)</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                <Package className="w-5 h-5" />
                <span>จัดการสินค้า</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/categories" className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                <Grid className="w-5 h-5" />
                <span>จัดการหมวดหมู่</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/change-password" className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                <Key className="w-5 h-5" />
                <span>เปลี่ยนรหัสผ่าน</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                <Settings className="w-5 h-5" />
                <span>ตั้งค่าโซเชียลมีเดีย</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <ClientForm action={handleLogout} successMessage="ออกจากระบบสำเร็จ!">
            <button type="submit" className="flex items-center gap-2 text-gray-400 hover:text-white w-full px-4 py-2">
              <LogOut className="w-5 h-5" />
              ออกจากระบบ
            </button>
          </ClientForm>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Mobile Header and Sidebar */}
        <AdminMobileSidebar logoutAction={handleLogout} />
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
