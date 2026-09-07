const fs = require('fs');
const path = require('path');

const map = {
  "กระเป๋า.png": "bags.png",
  "กลุ่มผลิตภัณฑ์เพื่อสุขภาพ.png": "health.png",
  "กล้องและอุปกรณ์ถ่ายภาพ.png": "cameras.png",
  "กีฬาและกิจกรรมกลางแจ้ง.png": "sports.png",
  "ของเล่น สินค้าแม่และเด็ก.png": "toys_kids.png",
  "ความงามและของใช้ส่วนตัว.png": "beauty.png",
  "คอมพิวเตอร์และแล็ปท็อป.png": "computers.png",
  "ช้อปปี้เพย์ใกล้ตัว.png": "shopeepay_near_me.png",
  "ตั๋วและบัตรกำนัล.png": "tickets_vouchers.png",
  "นาฬิกาและแว่นตา.png": "watches_glasses.png",
  "มือถือ และ แท็บเล็ต.png": "mobiles_tablets.png",
  "ยานยนต์.png": "automotive.png",
  "รองเท้าผู้ชาย.png": "mens_shoes.png",
  "รองเท้าผู้หญิง.png": "womens_shoes.png",
  "สัตว์เลี้ยง.png": "pets.png",
  "อาหารและเครื่องดื่ม.png": "food_beverages.png",
  "อุปกรณ์อิเล็กทรอนิกส์.png": "electronics.png",
  "เกมและอุปกรณ์เสริม.png": "gaming.png",
  "เครื่องประดับ.png": "jewelry.png",
  "เครื่องเขียน หนังสือ และงานอดิเรก.png": "books_hobbies.png",
  "เครื่องใช้ในบ้าน.png": "home_appliances.png",
  "เครื่องใช้ไฟฟ้าภายในบ้าน.png": "home_electronics.png",
  "เสื้อผ้าแฟชั่นผู้ชาย.png": "mens_fashion.png",
  "เสื้อผ้าแฟชั่นผู้หญิง.png": "womens_fashion.png"
};

const dir = path.join(__dirname, 'public', 'shopee_categories');

for (const [thai, en] of Object.entries(map)) {
  const oldPath = path.join(dir, thai);
  const newPath = path.join(dir, en);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${thai} -> ${en}`);
  }
}
console.log('Done!');
