# เกมรดน้ำต้นไม้ — Implementation Plan

เอกสารชุดนี้แตกการสร้างเกมออกเป็น **steps ตามลำดับการ implement จริง** อ่านเรียงจาก `00` → `10` ได้เลย แต่ละ step เป็น deliverable ที่สามารถ ship แยกได้ (รันได้จริงหลังจบ step)

## 🎯 สรุป Requirements (baseline)

- เกมปลูก + รดน้ำต้นไม้ แบบ 3D บน web (mobile-first)
- ต้นไม้ procedural generated ด้วย **seed-based L-system** (300 species templates × seed = unique ไม่จำกัด)
- Rarity tiers: **Common 200 / Rare 80 / Legendary 20** (drop rate 75% / 22% / 3%)
- Flow: **Plant → Water (cooldown 30 นาที) → Harvest เมื่อครบจำนวนครั้ง (1–10 สุ่ม)**
- **Gallery (Achievement)**: โชว์ต้นไม้ที่เก็บแล้ว, จำนวน harvested, distinct species unlocked `X/300`, กด View เปิด 3D detail
- ทีละ 1 ต้น, ต้นไม้ไม่ตาย
- Save ลง localStorage (schema-versioned, sync-ready สำหรับ cloud + login ในอนาคต)
- **Theme: off-white + warm tones** (ดู `02-design-system.md`)

## 🗂 โครงสร้างเอกสาร

| Step | File | Output |
|---|---|---|
| 00 | `00-overview.md` | เอกสารนี้ — roadmap + requirements |
| 01 | `01-project-setup.md` | Next.js 16 (App Router, static export) + TS + Tailwind + Three.js scaffold |
| 02 | `02-design-system.md` | Color tokens (off-white warm), typography, spacing, components |
| 03 | `03-data-model.md` | TypeScript types, SaveStore abstraction, localStorage keys, schema v1 |
| 04 | `04-tree-generator.md` | Seeded RNG + L-system + species table + geometry builder |
| 05 | `05-game-logic.md` | Zustand store + plant/water/harvest actions + cooldown |
| 06 | `06-rendering.md` | Three.js scene, camera, lighting, mobile performance |
| 07 | `07-screens.md` | PlotView + Gallery + DetailView + routing + animations |
| 08 | `08-mobile.md` | Mobile optimizations — viewport, haptics, safe-area, browser notifications (no PWA) |
| 09 | `09-testing.md` | Vitest unit + Playwright smoke + deterministic tests |
| 10 | `10-cloud-sync.md` | (Future) Auth + API + gzip blob + conflict resolution |
| 11 | `11-florist-card.md` | Shareable botanical passport — modal UI + Canvas 2D image generator + Web Share fallback |

## 🛣 Implementation Order & Milestones

```
Phase 1 — Foundation (Week 1)
  Step 01 → 02 → 03
  ✅ Deliverable: Project รันได้, theme พร้อม, save/load state ได้

Phase 2 — Core Game (Week 2)
  Step 04 → 05
  ✅ Deliverable: Plant/water/harvest logic ทำงาน (ยังไม่มี 3D)

Phase 3 — 3D & UI (Week 3)
  Step 06 → 07
  ✅ Deliverable: เล่นได้จริง มี Gallery, พร้อม ship MVP

Phase 4 — Polish (Week 4)
  Step 08 → 09
  ✅ Deliverable: PWA installable, tested, production-ready

Phase 5 — Cloud (Week 5+)
  Step 10
  ✅ Deliverable: Login + sync ข้ามเครื่อง
```

## 📦 Tech Stack (สรุป)

- **Framework**: **Next.js 16** (App Router) + TypeScript 5 (strict)
- **Rendering mode**: **Static export** (`output: 'export'`) — ทุกหน้าเป็น client component, ไม่มี SSR (canvas ต้อง render ใน browser อยู่แล้ว)
- **UI**: React 19 + Tailwind CSS 3
- **State**: Zustand 4 (adapter pattern รองรับ cloud sync ภายหลัง)
- **Routing**: App Router (`app/page.tsx`, `app/gallery/page.tsx`, `app/gallery/[id]/page.tsx`)
- **3D**: Three.js r160+ + `@react-three/fiber` + `@react-three/drei`
- **RNG**: `mulberry32` (inline) — deterministic
- **Testing**: Vitest + Playwright
- **Deploy**: **Cloudflare Pages** — upload `out/` directory จาก `next build`
- **Backend (future)**: **Cloudflare Workers** + D1 (SQLite)
- **ไม่ใช้ PWA / service worker** — เป็นเว็บธรรมดา ไม่มี offline mode, ไม่มี install-to-homescreen

> **หมายเหตุ — ผลกระทบจากการไม่ใช้ PWA:**
> - ❌ Web Push notification ทำไม่ได้ (ต้องใช้ SW) → เปลี่ยนเป็น **browser Notification API เฉพาะตอนเปิด tab** + in-app countdown
> - ❌ ไม่ใช้ได้ offline — แต่ข้อมูล save ยังอยู่ใน localStorage เหมือนเดิม
> - ✅ Setup ง่ายกว่า, bundle เล็กกว่า, ไม่ต้องจัดการ cache invalidation

## 🎨 Visual Direction

โทนสีแบบ **off-white warm** ให้ความรู้สึกอบอุ่น อ่อนโยน เหมือน morning light ในสวน ไม่สะท้อนแสงเป็นสีขาวจัด ช่วยให้ต้นไม้ 3D สีเขียวโดดเด่นขึ้น (ดูละเอียดใน `02-design-system.md`)

## ✅ Resolved Product Decisions

สรุปคำตอบจากคำถามรอบล่าสุด — ถูก bake เข้าไปใน step docs แล้ว:

| # | Question | Decision | อยู่ใน step |
|---|---|---|---|
| 1 | แจ้งเตือน cooldown หมด | **Browser Notification API (tab-open only)** — Web Push ตัดออกเพราะไม่ใช้ PWA | `08-mobile.md` |
| 2 | Interaction ระหว่าง cooldown | **Orbit + Pinch-zoom ได้ตลอดเวลา** (รวมหลัง harvest) | `06-rendering.md`, `07-screens.md` |
| 3 | Reset button | Reset **เฉพาะ active tree** (ไม่กระทบ Gallery), UI เป็น **SVG icon พลั่ว (shovel)** + confirm dialog | `05-game-logic.md` (`resetActiveTree`), `07-screens.md` |
| 4 | Stats ใน Gallery | เพิ่ม **Daily Check-in Streak** (🔥 X วัน + longest streak) | `03-data-model.md`, `05-game-logic.md`, `07-screens.md` |
| 5 | เสียง / เพลง | **Deferred** — infra พร้อมไว้แต่ไม่ผูกเสียงใน MVP, user จะหา asset มาเพิ่มทีหลัง | — |

---

ถัดไป → [`01-project-setup.md`](./01-project-setup.md)
