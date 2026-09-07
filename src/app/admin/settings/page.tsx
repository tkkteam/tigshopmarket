import { getSettings, updateSettings } from '@/actions/setting';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const setting = await getSettings();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ตั้งค่าโซเชียลมีเดีย</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form action={updateSettings} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ลิงก์ Facebook</label>
            <input 
              type="url" 
              name="facebook" 
              defaultValue={setting?.facebook || ''} 
              className="w-full border rounded px-3 py-2" 
              placeholder="https://facebook.com/..." 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ลิงก์ LINE (หรือ Line ID)</label>
            <input 
              type="text" 
              name="lineId" 
              defaultValue={setting?.lineId || ''} 
              className="w-full border rounded px-3 py-2" 
              placeholder="https://line.me/ti/p/... หรือ @lineid" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ลิงก์ YouTube</label>
            <input 
              type="url" 
              name="youtube" 
              defaultValue={setting?.youtube || ''} 
              className="w-full border rounded px-3 py-2" 
              placeholder="https://youtube.com/..." 
            />
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark">
              บันทึกการตั้งค่า
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
