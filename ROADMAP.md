# Florify Roadmap

---

## 1. Crossbreeding (ผสมพันธุ์)

เลือกสายพันธุ์ที่เก็บได้แล้ว 2 ชนิดมาผสมกัน ได้ต้นไม้ลูกผสม (hybrid) ที่หาไม่ได้จากการปลูกปกติ เช่น Sunleaf + Moonleaf = Eclipseleaf ผู้เล่นต้องทดลองผสมคู่ต่าง ๆ เอง เหมือนระบบ crafting แบบ discovery

## 2. Season & Event (ฤดูกาล)

ระบบฤดูกาลหมุนเวียนตามเวลาจริง (เช่น ทุก 2 สัปดาห์) แต่ละฤดูมี limited-edition species ที่ดรอปเฉพาะช่วงนั้น พร้อม theme สีพื้นหลังและ banner ที่เปลี่ยนไป ใช้ `new Date()` เช็คช่วงเวลา hardcode season schedule ใน code

## 4. Achievement & Quest (ภารกิจ)

ภารกิจรายวัน/รายสัปดาห์ เช่น "รดน้ำ 10 ครั้งวันนี้", "เก็บเกี่ยวต้นไม้ Rare 1 ต้น" พร้อม Achievement ถาวร เช่น "สะสม Common ครบ 100", "เก็บ Legendary ตัวแรก" ให้รางวัลเป็น bonus water drops หรือ cosmetic badges บน Florist Card

## 6. Weather (สภาพอากาศ)

สุ่มสภาพอากาศเปลี่ยนทุกวัน (แดด, ฝน, พายุ, หมอก) โดยใช้ date-based seed — ทุกคนเจอสภาพอากาศเดียวกันในวันเดียวกัน แต่ละสภาพอากาศมีผลต่อเกม:

- วันฝนตก → drop regen เร็วขึ้น 2x
- วันแดดจัด → ต้นไม้โตเร็วขึ้น (รดน้ำ 1 ครั้งนับเป็น 2)
- วันพายุ → drop rate ของ rare เพิ่มขึ้น

## 7. Compost & Fertilizer (ปุ๋ย)

เก็บเกี่ยวต้นไม้ได้ "ใบไม้แห้ง" ตามความ rarity (common = 1, rare = 3, legendary = 10) สะสมแล้วแปลงเป็นปุ๋ยชนิดต่าง ๆ:

- Speed Fertilizer — ลดจำนวนน้ำที่ต้องรด
- Lucky Fertilizer — เพิ่ม rare drop rate ต้นถัดไป
- Golden Fertilizer — การันตี rare ขึ้นไป

## 8. Flora Journal (สมุดบันทึก)

สมุดบันทึกอัตโนมัติที่จดทุก milestone สำคัญพร้อม timestamp เช่น "12 มี.ค. — เก็บ Legendary ตัวแรก: Cinderleaf", "25 มี.ค. — สะสมครบ 100 สายพันธุ์" ผู้เล่นเปิดอ่านย้อนหลังได้เหมือนไดอารี่ แชร์เป็นรูปได้เหมือน Florist Card

## 11. Daily Login & Streak Bonus (รางวัลเข้าเกมรายวัน)

ระบบรางวัลสำหรับการเข้าเกมทุกวัน (ต่อยอดจาก streak ที่มีอยู่แล้ว):

- **Daily Login Reward** — เข้าเกมแต่ละวันได้ bonus water drops (เช่น วันละ 3-5 drops)
- **Streak Milestone Bonus** — เข้าติดต่อกันครบจำนวนวันที่กำหนดได้รางวัลพิเศษ:
  - 7 วัน → bonus drops จำนวนมาก
  - 14 วัน → Lucky Fertilizer (ถ้ามีระบบปุ๋ย)
  - 30 วัน → การันตี rare species ครั้งถัดไป
  - 100 วัน → cosmetic badge พิเศษบน Florist Card
- **Streak Calendar UI** — ปฏิทินแสดงวันที่เข้าเกม เห็นภาพรวม streak ชัดเจน
