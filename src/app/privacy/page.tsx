export const dynamic = 'force-static';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm text-gray-600 space-y-4">
        <p>TIG CENTER ให้ความสำคัญกับความเป็นส่วนตัวของคุณ นโยบายนี้อธิบายถึงวิธีที่เรารวบรวม ใช้งาน และปกป้องข้อมูลส่วนบุคคลของคุณ</p>
        <h2 className="text-xl font-bold text-gray-800 mt-6">1. ข้อมูลที่เรารวบรวม</h2>
        <p>เราอาจรวบรวมข้อมูลส่วนบุคคลของคุณ เช่น ชื่อ ที่อยู่อีเมล เบอร์โทรศัพท์ และข้อมูลการใช้งานเว็บไซต์ เมื่อคุณลงทะเบียนหรือใช้บริการของเรา</p>
        <h2 className="text-xl font-bold text-gray-800 mt-6">2. การใช้งานข้อมูล</h2>
        <p>เราใช้ข้อมูลของคุณเพื่อให้บริการ ปรับปรุงประสบการณ์การใช้งาน และติดต่อสื่อสารกับคุณเกี่ยวกับการอัปเดตและโปรโมชั่นต่างๆ</p>
        <h2 className="text-xl font-bold text-gray-800 mt-6">3. การปกป้องข้อมูล</h2>
        <p>เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลส่วนบุคคลของคุณจากการเข้าถึง การเปลี่ยนแปลง หรือการทำลายโดยไม่ได้รับอนุญาต</p>
        <p className="pt-8 text-sm text-gray-400">ปรับปรุงล่าสุด: {new Date().toLocaleDateString('th-TH')}</p>
      </div>
    </div>
  );
}
