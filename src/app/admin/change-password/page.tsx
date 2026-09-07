import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function ChangePasswordPage() {
  
  async function handleChangePassword(formData: FormData) {
    'use server';
    
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      redirect('/admin/change-password?error=mismatch');
    }

    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN', email: 'admin' }
    });

    if (!adminUser || adminUser.password !== currentPassword) {
      redirect('/admin/change-password?error=incorrect');
    }

    await prisma.user.update({
      where: { id: adminUser.id },
      data: { password: newPassword }
    });

    redirect('/admin/change-password?success=1');
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">เปลี่ยนรหัสผ่าน (Change Password)</h1>
      
      <form action={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านปัจจุบัน</label>
          <input 
            type="password" 
            name="currentPassword" 
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านใหม่</label>
          <input 
            type="password" 
            name="newPassword" 
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
          <input 
            type="password" 
            name="confirmPassword" 
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-primary"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors mt-4"
        >
          บันทึกรหัสผ่าน
        </button>
      </form>
    </div>
  );
}
