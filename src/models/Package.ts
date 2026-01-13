export interface Package {
  package_id: string;

  package_name: string;
  description: string;

  total_sessions: number;     // จำนวนครั้งทั้งหมด
  remaining_sessions: number; // ครั้งที่เหลือ

  price: number;              // ราคาขาย

  start_date: string;         // วันที่เริ่มใช้
  expire_date: string;        // วันหมดอายุ

  status: "ACTIVE" | "EXPIRED" | "USED_UP";

  created_at: string;
  updated_at: string;
}
