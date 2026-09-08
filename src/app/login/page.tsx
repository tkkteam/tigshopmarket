import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_token');
  
  if (adminToken?.value === 'authenticated') {
    redirect('/admin');
  }

  async function handleLogin(formData: FormData) {
    'use server';
    
    const id = formData.get('id') as string;
    const password = formData.get('password') as string;
    const cookiesObj = await cookies();

    // Check if admin user exists, if not create one with default credentials
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN', email: 'admin' }
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          name: 'Admin',
          email: 'admin', // Using email field as ID
          password: 'admin999', // Plain text for simplicity as no crypto lib is installed
          role: 'ADMIN',
        }
      });
    }

    if (id === adminUser.email && password === adminUser.password) {
      cookiesObj.set('admin_token', 'authenticated', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 // 1 day
      });
      redirect('/admin');
    } else {
      redirect('/login?error=1');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h1>
        
        <form action={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <input 
              type="text" 
              name="id" 
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primary"
              placeholder="admin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition-colors mt-4"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
