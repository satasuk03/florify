# Florify — Brand & Marketing Base Document

> เอกสารนี้รวบรวมข้อมูลทั้งหมดเกี่ยวกับเกม Florify เพื่อใช้เป็นฐานข้อมูลสำหรับงาน Branding และ Marketing

---

## 1. Overview

| รายการ | รายละเอียด |
|---|---|
| ชื่อเกม | **Florify** |
| แนวเกม | Idle Garden / Collection Game |
| แพลตฟอร์ม | Mobile-first Web Game (เล่นผ่านเบราว์เซอร์) |
| URL | https://florify.zeze.app/ |
| ภาษา | ไทย (default) + English |
| ราคา | ฟรี 100% — ไม่มี IAP, ไม่มีโฆษณา |
| จำนวนสายพันธุ์ | 302 สายพันธุ์ (300 Original + 2 Chinese Garden) |

### Tagline

- **TH**: "ปลูก รดน้ำ เก็บสะสมต้นไม้สุ่มสร้างของคุณเอง"
- **EN**: "Plant, water & collect procedurally-generated trees"

### Elevator Pitch

Florify คือเกมสวนจิ๋วบนมือถือที่ให้คุณปลูกเมล็ด รดน้ำทุกวัน แล้วเก็บสะสมต้นไม้สุ่มสร้างหลายร้อยสายพันธุ์ในแกลเลอรีของคุณเอง — เกมที่เน้นความผ่อนคลาย การค้นพบ และการสะสม ไม่มีการแข่งขัน ไม่มีความรุนแรง แค่สวนเล็กๆ ที่เติบโตไปพร้อมกับคุณ

---

## 2. Game Concept & Identity

### แก่นของเกม (Core Pillars)

1. **Meditative** — ผ่อนคลาย ไม่เร่งรีบ ไม่มีเวลาจำกัด ไม่มีแพ้-ชนะ
2. **Discovery** — ค้นพบสายพันธุ์ใหม่ทุกครั้งที่ปลูก แต่ละต้นมีเรื่องราวเป็นเอกลักษณ์
3. **Collection** — สะสมครบ 302 สายพันธุ์คือเป้าหมายสูงสุด
4. **Daily Ritual** — สร้างนิสัยกลับมารดน้ำทุกวัน เหมือนดูแลสวนจริง
5. **Poetic Worldbuilding** — ต้นไม้ทุกต้นมี lore ที่เขียนขึ้นเป็นพิเศษ ทั้งภาษาไทยและอังกฤษ

### เทียบเคียงกับเกมอื่น (Comparable Games)

- **Neko Atsume** — ความสุขจากการสะสม + กลับมาเช็คทุกวัน
- **Animal Crossing** — ความผ่อนคลาย + ดูแลพื้นที่ของตัวเอง
- **Viridi** — เกมปลูกต้นไม้ที่เน้น mindfulness
- แต่ Florify มีจุดต่างคือ **3D procedurally-generated trees** + **lore สองภาษา**

---

## 3. Gameplay Mechanics

### Core Loop: ปลูก → รดน้ำ → เก็บเกี่ยว

```
[ ปลูก ] → สุ่มสายพันธุ์ + ระดับ rarity
    ↓
[ รดน้ำ ] → ใช้หยดน้ำ 1 หยดต่อครั้ง (ต้นละ 12-25 หยด)
    ↓
[ ต้นไม้เติบโต ] → ดู progress 0-100% + เห็น 3D model เปลี่ยน 3 ระยะ
    ↓
[ เก็บเกี่ยว ] → ต้นไม้เข้าแกลเลอรี + ปลดล็อคสายพันธุ์ใหม่
    ↓
[ ปลูกต้นใหม่ ] → วนลูปใหม่
```

### ระบบหยดน้ำ (Water Drops)

| รายการ | ค่า |
|---|---|
| จำนวนสูงสุด | 50 หยด |
| อัตราฟื้นฟู | 1 หยดทุก 3 นาที |
| ค่าใช้จ่ายต่อครั้งรดน้ำ | 1 หยด |
| จำนวนหยดต่อต้น | 12-25 หยด (สุ่ม) |
| ต้นแรก (onboarding) | 10 หยด |

### การเติบโต 3 ระยะ

1. **Seedling** (กล้า) — stage-1.webp
2. **Young** (วัยรุ่น) — stage-2.webp
3. **Mature** (โตเต็มวัย) — stage-3.webp

ผู้เล่นเห็น 3D model เปลี่ยนรูปร่างตามระยะการเติบโต พร้อม auto-rotate อย่างช้าๆ

---

## 4. Rarity System

### 3 ระดับความหายาก

| ระดับ | จำนวนสายพันธุ์ | อัตราดรอป | สี |
|---|---|---|---|
| **Common** | 200 สายพันธุ์ | 75% | Warm Taupe (#B8A888) |
| **Rare** | 80 สายพันธุ์ | 20% | Dusty Blue (#7A9CB8) |
| **Legendary** | 22 สายพันธุ์ | 5% | Warm Gold (#D4A24C) |

การสุ่มสายพันธุ์ใช้ระบบ weighted random — ทุกครั้งที่ปลูกมีลุ้นได้ Legendary 5%

---

## 5. Progression System

### Florist Rank (ระดับนักพฤกษศาสตร์)

| Rank | สายพันธุ์ที่ต้องสะสม |
|---|---|
| **Seedling** (กล้าไม้) | 0 – 20 |
| **Apprentice** (ฝึกหัด) | 21 – 60 |
| **Gardener** (ชาวสวน) | 61 – 120 |
| **Master** (ปรมาจารย์) | 121 – 240 |
| **Legend** (ตำนาน) | 241 – 300 |

### ตัวชี้วัดความก้าวหน้า

- จำนวนสายพันธุ์ที่ปลดล็อค (X / 300)
- แถบความก้าวหน้าแยกตามระดับ rarity
- Daily Streak — จำนวนวันที่เข้าเล่นติดต่อกัน
- Longest Streak — สถิติสูงสุด
- Total Harvested — จำนวนต้นไม้ที่เก็บเกี่ยวตลอดการเล่น

---

## 6. Content & Lore

### สายพันธุ์ตัวอย่าง

| ชื่อ | Rarity | Lore (EN) |
|---|---|---|
| **Sunleaf** | Common | "The first leaf to open its face to the morning, every morning, since the world was new." |
| **Moonbloom** | Common | "Opens at moonrise and closes the instant the first bird sings, as if embarrassed to be seen in daylight." |
| **Dreamfern** | Common | "A leaf that rustles when nobody is in the room, as if replaying a conversation it overheard in someone's sleep." |
| **Nightfern** | Rare | ต้นไม้ที่จำได้และปกป้อง — ขโมยกลัวมัน |
| **Coralleaf** | Legendary | เกิดจากดาวตก สอนเรื่องกาลเวลาอันยาวนาน |

### ธีม Lore หลัก

- ต้นไม้มีคุณสมบัติวิเศษ / มีจิตวิญญาณ
- เวลา (พระอาทิตย์ขึ้น-ตก, ฤดูกาล) เป็นแกนสำคัญ
- อารมณ์ความรู้สึกหล่อหลอมพฤติกรรมของพืช
- ความทรงจำ ความฝัน และความสูญเสีย เป็น motif ที่ปรากฏซ้ำ

### Collections

- **Original** — 300 สายพันธุ์หลัก
- **Chinese Garden** — 2 สายพันธุ์พิเศษ (คอลเลกชันขยายได้ในอนาคต)

---

## 7. Features & UI

### หน้าจอหลัก (PlotView)

- ต้นไม้ 3D เต็มจอ — หมุนอัตโนมัติ + ผู้เล่นหมุน/ซูมได้
- ปุ่ม action เดียวตรงกลางล่าง: "ปลูก" หรือ "รดน้ำ"
- ตัวบอก % การเติบโต
- ปุ่มมุมซ้ายบน: แกลเลอรี
- ปุ่มมุมขวาบน: Florist Card + Login (Coming Soon)

### แกลเลอรี (Floripedia)

- เรียกดูทั้ง 302 สายพันธุ์ (พบแล้ว / ยังไม่พบ)
- ค้นหาด้วยชื่อ, คำอธิบาย, คอลเลกชัน
- ฟิลเตอร์: พบ/ไม่พบ, ระดับ rarity, คอลเลกชัน
- กดดูรายละเอียด: 3D inspect + lore เต็ม (สลับ TH/EN)

### Florist Card (บัตรนักพฤกษศาสตร์)

- แสดง rank, สายพันธุ์ที่สะสม, streak, rarity breakdown
- **แชร์ได้** — สร้างภาพ 1080×1920 PNG สำหรับ Instagram Story / TikTok
- มี serial number เฉพาะตัว (เช่น "FL-3K2P-9XQ4")
- ใช้ Web Share API หรือดาวน์โหลดภาพ

### Guide Book

- วิธีเล่น (ปลูก / รดน้ำ / เก็บเกี่ยว)
- อธิบายระบบ rarity + อัตราดรอป
- อธิบายระบบ daily streak

### Settings

- ตั้งชื่อแสดง (สูงสุด 24 ตัวอักษร)
- สลับภาษา TH / EN
- เปิด/ปิด haptics (Android)
- เปิด/ปิด notifications (in-tab)
- Export/Import save code (base64 backup)
- Reset ข้อมูลทั้งหมด

---

## 8. Visual Identity

### Color Palette

#### พื้นหลัก (Background)

| ชื่อ | Hex | ใช้งาน |
|---|---|---|
| Cream | `#FBF8F3` | พื้นหลังหลัก |
| Warm White | `#F5F0E8` | พื้นหลังรอง |
| Soft Beige | `#EDE5D8` | Surface |
| Muted Sand | `#D1C0A0` | พื้นหลัง muted |

#### ข้อความ (Text)

| ชื่อ | Hex | ใช้งาน |
|---|---|---|
| Warm Black | `#2B241B` | หัวข้อหลัก |
| Dark Brown | `#4A3F33` | เนื้อหา |
| Medium Brown | `#6B6052` | ข้อความรอง |
| Light Brown | `#9C8F7B` | ข้อความ disabled |

#### สี Accent

| ชื่อ | Hex | ใช้งาน |
|---|---|---|
| Clay / Terracotta | `#C7825A` | ปุ่ม action หลัก |
| Leaf Green | `#6B8E4E` | สำเร็จ, ธรรมชาติ |
| Water Blue | `#8EB5C7` | หยดน้ำ, ข้อมูล |

#### สี Rarity

| ระดับ | Hex | ลักษณะ |
|---|---|---|
| Common | `#B8A888` | Warm Taupe |
| Rare | `#7A9CB8` | Dusty Blue |
| Legendary | `#D4A24C` | Warm Gold |

### Typography

| ใช้งาน | ฟอนต์ | ลักษณะ | Weights |
|---|---|---|---|
| UI / Body | **Sarabun** | Sans-serif, รองรับไทย | 400, 500, 600, 700 |
| Headlines | **Fraunces** | Warm Serif | 500, 600, 700 |

### Art Direction

- **Aesthetic**: แสงยามเช้าในสวนพฤกษศาสตร์ — อบอุ่น นุ่มนวล
- **Mood**: กระดาษครีม, ผ้าลินิน, ดินเผา
- **Shadow**: เงานุ่ม ไม่มีสีดำตัด
- **Chrome**: น้อยที่สุด — ให้ content เป็นพระเอก
- **3D Style**: ต้นไม้ render ด้วยแสงอุ่นยามเช้า พื้นสีดินเหนียว หมุนช้าๆ เมื่อ idle

---

## 9. Technical Overview

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Static Export) |
| UI | React 19 + TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 |
| 3D | Three.js + @react-three/fiber + @react-three/drei |
| Testing | Vitest + Playwright |
| Hosting | Cloudflare Pages |
| Storage | localStorage (browser) |

### Architecture

- **Monorepo** (pnpm workspace): `apps/web/` + `packages/shared/` + `apps/scripts/`
- **Static Export** — ไม่มี server, deploy เป็น static files
- **Responsive** — Mobile-first (480px) + Desktop fallback
- **RNG** — Deterministic `mulberry32` seeded random สำหรับสร้างต้นไม้

### Browser Requirements

- ES2020+ JavaScript
- WebGL (สำหรับ Three.js 3D rendering)
- Modern browser (Chrome, Safari, Firefox, Edge)

---

## 10. Social & Sharing

### Florist Card Share

- ผู้เล่นสร้าง **PNG 1080×1920** ของ Florist Card
- เหมาะสำหรับ Instagram Story, TikTok, Twitter
- แสดง: rank, สายพันธุ์สะสม, streak, serial number
- ใช้ Web Share API (mobile) หรือดาวน์โหลด (desktop)

### No Multiplayer (MVP)

- ไม่มี leaderboard
- ไม่มี social feed
- ไม่มี friend system
- การแชร์เป็นแบบ one-way (share ภาพออกไป ไม่มี link กลับ)

---

## 11. Monetization

### MVP: ฟรีทั้งหมด

- ไม่มี In-App Purchase
- ไม่มีโฆษณา
- ไม่มี Premium tier
- ไม่มี NFT / Blockchain / Web3

### โมเดลในอนาคต (ยังไม่ตัดสินใจ)

- Cloud sync subscription
- Cosmetics / Skins
- โฆษณา (low priority)

---

## 12. Target Audience

### Primary

- **กลุ่มอายุ**: 18-35 ปี
- **สนใจ**: เกม casual, mindfulness, ธรรมชาติ, สะสมของ
- **พฤติกรรม**: เล่นเกมบนมือถือระหว่างพัก, ชอบเกมที่ไม่ต้องคิดหนัก
- **ตัวอย่าง**: คนที่ชอบ Neko Atsume, Animal Crossing Pocket Camp, Viridi

### Secondary

- **คนที่ชอบศิลปะ/สุนทรียะ** — ดึงดูดด้วย art style อบอุ่น
- **คนอ่านหนังสือ/นักเขียน** — ดึงดูดด้วย lore ที่เป็นบทกวี
- **เด็กและครอบครัว** — ปลอดภัย ไม่มีความรุนแรง ไม่มี IAP

---

## 13. Key Differentiators

1. **3D Procedurally-Generated Trees** — ต้นไม้ทุกต้นถูกสร้างด้วยอัลกอริทึม ไม่มีต้นไหนเหมือนกัน
2. **Bilingual Poetic Lore** — ทุกสายพันธุ์มีเรื่องเล่าที่เขียนเป็นพิเศษ ทั้ง TH และ EN
3. **Zero Friction** — เล่นผ่าน browser ทันที ไม่ต้องดาวน์โหลด ไม่ต้อง sign up
4. **Warm Aesthetic** — art direction ที่โดดเด่น หลีกเลี่ยงสีสดจัด ใช้โทนอบอุ่นธรรมชาติ
5. **No Pressure** — ไม่มี timer, ไม่มี energy system กดดัน, ไม่มี FOMO mechanics
6. **302 Species** — ปริมาณ content ที่มากพอสำหรับการสะสมระยะยาว
7. **Completely Free** — ไม่มี paywall ใดๆ ทั้งสิ้น

---

## 14. Brand Voice & Tone

### น้ำเสียง

- **อบอุ่น** — เหมือนเพื่อนที่ชวนมาดูสวน ไม่ใช่แบรนด์ที่ขายของ
- **เรียบง่าย** — ใช้ภาษาที่เข้าใจง่าย ไม่ซับซ้อน
- **กวี** — โดยเฉพาะใน lore ของต้นไม้ มีความเพ้อฝัน
- **ไม่เร่งรีบ** — ไม่มี urgency, ไม่มี "รีบมาเล่นก่อนหมดเวลา"

### Do's

- ใช้ภาษาที่สื่อถึงธรรมชาติ แสง เช้า สายลม
- พูดถึงการค้นพบ ความอยากรู้ ความแปลกใจ
- ให้ความรู้สึก cozy, safe, personal
- ใช้โทนสีอบอุ่นในทุก material

### Don'ts

- อย่าใช้ภาษา competitive (อันดับ 1, ชนะ, เอาชนะ)
- อย่าใช้ urgency tactics (เหลืออีกแค่ X วัน, limited time)
- อย่าใช้สีสดจัดหรือ neon
- อย่าใช้ศัพท์ gaming hardcore (DPS, meta, nerf, buff)

---

## 15. Asset Summary

### ภาพต้นไม้

- **302 สายพันธุ์ × 3 ระยะ = 906 ภาพ** (WebP format)
- ตำแหน่ง: `apps/web/public/floras/{species_folder}/stage-{1,2,3}.webp`

### ฟอนต์

- Sarabun (Google Fonts) — UI ทั่วไป
- Fraunces (Google Fonts) — หัวข้อ

### สี

- ดู Section 8 (Visual Identity) สำหรับ palette ทั้งหมด

---

## 16. Future Roadmap (Planned)

| Phase | Feature |
|---|---|
| Cloud Sync | Login + ซิงค์ข้อมูลข้ามอุปกรณ์ (Cloudflare Workers + D1) |
| Sound | เสียงประกอบ (UI พร้อมแล้ว รอ asset) |
| New Collections | คอลเลกชันสายพันธุ์ใหม่ (ขยายจาก Chinese Garden) |
| PWA | ติดตั้งเป็นแอปบนหน้าจอ |
| Social | ดูสวนของเพื่อน / leaderboard |

---

## 17. Quick Facts (สำหรับ Press Kit)

- **ชื่อ**: Florify
- **แนว**: Idle Garden / Collection Game
- **แพลตฟอร์ม**: Web (Mobile-first)
- **ราคา**: ฟรี
- **สายพันธุ์**: 302
- **ภาษา**: ไทย + อังกฤษ
- **3D**: Procedurally-generated trees
- **เล่นได้ที่**: https://florify.zeze.app/
- **สร้างด้วย**: Next.js, React, Three.js, TypeScript
- **Host**: Cloudflare Pages
