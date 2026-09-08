export const dynamic = 'force-static';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">ข้อตกลงในการให้บริการ (Terms of Service)</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm text-gray-600 space-y-4">
        <p>ยินดีต้อนรับสู่ TIG CENTER ข้อตกลงในการให้บริการนี้กำหนดเงื่อนไขในการใช้งานเว็บไซต์และบริการของเรา</p>
        <p>คุณยอมรับว่าการเข้าถึงและใช้งานบริการของเราอยู่ภายใต้ข้อตกลงเหล่านี้ หากคุณไม่เห็นด้วยกับข้อตกลงเหล่านี้ โปรดหยุดใช้งานบริการของเรา</p>
        <h2 className="text-xl font-bold text-gray-800 mt-6">1. การใช้งานบริการ</h2>
        <p>คุณตกลงที่จะใช้บริการของเราเพื่อวัตถุประสงค์ที่ถูกกฎหมายและไม่ละเมิดสิทธิ์ของบุคคลที่สาม</p>
        <h2 className="text-xl font-bold text-gray-800 mt-6">2. บัญชีผู้ใช้</h2>
        <p>คุณมีหน้าที่รับผิดชอบในการรักษาความลับของบัญชีและรหัสผ่านของคุณ รวมถึงกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของคุณ</p>
        <h2 className="text-xl font-bold text-gray-800 mt-6">3. การเปลี่ยนแปลงข้อตกลง</h2>
        <p>เราขอสงวนสิทธิ์ในการแก้ไขหรือเปลี่ยนแปลงข้อตกลงนี้เมื่อใดก็ได้ โดยไม่ต้องแจ้งให้ทราบล่วงหน้า</p>
        <p className="pt-8 text-sm text-gray-400">ปรับปรุงล่าสุด: {new Date().toLocaleDateString('th-TH')}</p>
      </div>
    </div>
  );
}
