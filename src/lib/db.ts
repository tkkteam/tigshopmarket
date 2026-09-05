import oracledb from 'oracledb';

// โหลดการตั้งค่าการเชื่อมต่อจาก .env
const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING, // ตัวอย่าง: "localhost:1521/XEPDB1"
};

// ฟังก์ชันสำหรับรันคำสั่ง SQL
export async function executeQuery(sql: string, binds: any[] = [], options: any = {}) {
  let connection;
  try {
    // สร้างการเชื่อมต่อกับ Oracle
    connection = await oracledb.getConnection(dbConfig);
    
    // ตั้งค่าให้ส่งผลลัพธ์กลับมาเป็น Object (แทนที่จะเป็น Array)
    const defaultOptions = { outFormat: oracledb.OUT_FORMAT_OBJECT, ...options };
    
    // สั่งรัน SQL
    const result = await connection.execute(sql, binds, defaultOptions);
    return result.rows;
  } catch (err) {
    console.error('Oracle DB Error: ', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close(); // ปิดการเชื่อมต่อเสมอเพื่อป้องกัน Connection leak
      } catch (err) {
        console.error('Error closing connection: ', err);
      }
    }
  }
}
