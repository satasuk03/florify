# เกมรดน้ำต้นไม้ — System Design

> Mobile-first 3D web game. เริ่มปลูก → รดน้ำทุก 30 นาที → ครบแล้วเก็บเข้า Achievement collection (300 ต้น, rarity tiers).

เอกสารนี้สรุป requirements, architecture, data model, API contracts, และ trade-offs สำหรับ MVP v1 (local storage only) โดยเตรียม schema ให้พร้อม cloud sync ในเฟสถัดไป

---

## 1. Requirements

### 1.1 Functional
- **Plant**: เริ่มปลูกต้นไม้ 1 ต้น (ทีละ 1 ต้นต่อผู้เล่น). ระบบสุ่ม:
  - `seed` (uint32) → ใช้เป็น deterministic input ของ L-system generator
  - `species` / `rarity` → สุ่มตาม drop table
  - `requiredWaterings` ∈ [1, 10]
- **Water**: กดรดน้ำได้ทุก 30 นาที (strict cooldown). ต้นไม้ไม่ตาย ไม่มี penalty ถ้ารดช้า
- **Harvest**: เมื่อ `currentWaterings == requiredWaterings` ต้นไม้จะย้ายเข้า **Gallery** โดยอัตโนมัติ, active plot ว่าง, ผู้เล่นกดเริ่มปลูกใหม่ได้
- **Gallery (Achievement)**: หน้ารวมต้นไม้ที่เคยเก็บทั้งหมด
  - แสดง **จำนวนที่เก็บแล้ว** (total harvested) และ **จำนวน species ที่ปลดล็อก** (e.g. `47 / 300`)
  - Grid ของ thumbnails แต่ละต้น
  - กด **View** → เปิด detail view ของต้นนั้น แสดงแบบ 3D interactive (orbit / pinch-zoom), meta: rarity, species name, seed, วันที่เก็บ, กี่ครั้งที่รด
- **Save**: state ทั้งหมดเก็บใน `localStorage` โดย schema ออกแบบให้ sync-ready
- **(Future) Cloud sync**: login + ส่ง JSON state (gzip) ขึ้น DB

### 1.2 Non-functional
- **Mobile-first**: ใช้งานได้ดีบน iOS Safari / Chrome Android, touch-first interactions
- **Performance**: load time < 3s บน 4G, render 60fps บน mid-range mobile (iPhone 12, Pixel 6)
- **Offline**: ใช้ได้เต็มรูปแบบแบบ offline (PWA)
- **Bundle size**: เป้าหมาย < 500 KB gzipped (รวม Three.js tree-shaken)
- **Persistence**: save data < 1 MB ใน localStorage แม้เก็บครบ 300 ต้น
- **Deterministic**: seed เดียวกัน → ต้นไม้หน้าตาเดียวกันเสมอ (สำคัญสำหรับ sync และ replay)

### 1.3 Constraints / Assumptions
- Single-player, no multiplayer, no leaderboard ใน MVP
- ไม่มี monetization / IAP ใน MVP
- Client-only app ใน v1 (static hosting เช่น Cloudflare Pages / Vercel)
- ผู้เล่นปลูกได้ 1 ต้นต่อช่วงเวลา

---

## 2. High-Level Architecture

### 2.1 MVP (v1) — Client-only
```
┌─────────────────────────────────────────────┐
│              Browser (Mobile)               │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │        React UI Layer (Vite)          │  │
│  │  HomeScreen · PlotView · Achievements │  │
│  └────────────┬──────────────────────────┘  │
│               │                             │
│  ┌────────────▼─────────┐  ┌─────────────┐  │
│  │  Game State (Zustand)│◄─┤ Timer (RAF) │  │
│  └────────────┬─────────┘  └─────────────┘  │
│               │                             │
│  ┌────────────▼──────────┐ ┌────────────┐   │
│  │  Tree Generator       │ │ Three.js   │   │
│  │  (seeded L-system)    │─▶  Renderer  │   │
│  └────────────┬──────────┘ └────────────┘   │
│               │                             │
│  ┌────────────▼──────────┐                  │
│  │  SaveStore (versioned)│                  │
│  │     localStorage      │                  │
│  └───────────────────────┘                  │
└─────────────────────────────────────────────┘
```

### 2.2 Future (v2) — Cloud-sync
```
         Client  ──HTTPS──▶  Auth (OAuth / magic link)
                                │
                                ▼
                        ┌──────────────┐
                        │  API Gateway │  /sync, /login
                        └──────┬───────┘
                               │
                     ┌─────────▼──────────┐
                     │  Save Service      │
                     │  (gzip JSON blob)  │
                     └─────────┬──────────┘
                               │
                     ┌─────────▼──────────┐
                     │  Postgres / KV     │
                     │ users, save_blobs  │
                     └────────────────────┘
```

---

## 3. Tech Stack

| Layer | Choice | เหตุผล |
|---|---|---|
| Build | **Vite + TypeScript** | เร็ว, DX ดี, tree-shaking Three.js ได้ |
| UI | **React 18** + Tailwind CSS | mobile-first styling, component model คุ้น |
| State | **Zustand** | เล็ก (~1KB), ไม่มี boilerplate, subscribe ง่าย |
| 3D | **Three.js** (r160+) | mature, well-documented, mobile support OK |
| RNG | **seedrandom / mulberry32** | deterministic PRNG สำหรับ seed-based gen |
| PWA | **vite-plugin-pwa** | offline + install to home screen |
| Storage | **localStorage** + abstraction | สำหรับ MVP; สลับเป็น cloud adapter ภายหลังได้ |
| Testing | Vitest + Playwright | unit + smoke |

---

## 4. Data Model

### 4.1 Core Types (TypeScript)

```ts
// Stable across versions. ถ้าแก้ breaking → bump schemaVersion
type Rarity = 'common' | 'rare' | 'legendary';

interface TreeInstance {
  id: string;              // uuid v4
  seed: number;            // uint32, กำหนด geometry
  speciesId: number;       // 0..N (ดู species table)
  rarity: Rarity;
  requiredWaterings: number;   // 1..10, คงที่ตั้งแต่เริ่มปลูก
  currentWaterings: number;    // 0..requiredWaterings
  plantedAt: number;           // epoch ms
  lastWateredAt: number | null;
  harvestedAt: number | null;  // null ถ้ายังไม่เก็บ
}

interface PlayerState {
  schemaVersion: 1;
  userId: string;              // local uuid; ผูก account ภายหลังตอน cloud sync
  createdAt: number;
  updatedAt: number;           // ใช้ทำ last-writer-wins ตอน sync
  activeTree: TreeInstance | null;  // null = slot ว่าง รอปลูกใหม่
  collection: TreeInstance[];       // harvested trees (ลำดับใหม่อยู่ท้าย)
  stats: {
    totalPlanted: number;
    totalWatered: number;
    totalHarvested: number;
  };
}
```

### 4.2 Species & Rarity Table

```ts
// เก็บเป็น static JSON, bundled กับแอป
interface Species {
  id: number;
  name: string;             // "Maple", "Pine", "Cherry Blossom", ...
  rarity: Rarity;
  // L-system parameters (base; seed จะ perturb ค่าเหล่านี้)
  lSystem: {
    axiom: string;
    rules: Record<string, string>;
    iterations: number;        // 3..6
    angleBase: number;         // deg, ± jitter จาก seed
    lengthBase: number;
    thicknessBase: number;
    leafColor: [number, number, number];   // HSL base
    trunkColor: [number, number, number];
  };
}
```

**Rarity distribution (total 300 unique species slots)**
| Rarity | Count | Drop rate per plant | Notes |
|---|---|---|---|
| Common | 200 | 75% | ต้นไม้ทั่วไป, geometry เรียบง่าย |
| Rare | 80 | 22% | มี leaf variation, สีพิเศษ |
| Legendary | 20 | 3% | exotic shapes, glow effects |

หมายเหตุ: 300 "species" คือ template parameters ตายตัว. ความเป็น unique ของแต่ละต้นมาจาก `seed` ที่ perturb parameters. ผู้เล่นปลดล็อกตาม speciesId → เก็บใน set เดียวกันได้แต่นับเป็น species เดียวใน collection progress (e.g. 47/300)

### 4.3 Storage Schema (localStorage)

```
key: "florify:v1:player"
value: JSON.stringify(PlayerState)

key: "florify:v1:settings"
value: { sound: bool, haptics: bool, reducedMotion: bool }
```

**Size estimate**: 300 harvested trees × ~200 bytes = 60 KB → ปลอดภัยมากสำหรับ 5 MB localStorage quota

---

## 5. Core Algorithms

### 5.1 Seeded RNG
ใช้ **mulberry32** — fast, deterministic, good enough distribution:
```ts
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```
ทุกการสุ่มใน generator ใช้ RNG ที่ seeded จาก `TreeInstance.seed` เท่านั้น → ต้นไม้ deterministic สมบูรณ์

### 5.2 L-System Tree Generation
1. Pick species → get base L-system params
2. Create `rng = mulberry32(tree.seed)`
3. Perturb params: `angle = angleBase + rng() * 10 - 5`, ฯลฯ
4. Expand axiom ด้วย rules × iterations → string
5. Interpret string เป็น turtle graphics:
   - `F` = draw cylinder forward
   - `+` / `-` = rotate
   - `[` / `]` = push/pop state
6. สร้าง `BufferGeometry` รวม trunk cylinders + leaf quads/instanced spheres
7. **Cache**: เก็บ geometry ใน-memory โดย key = seed (avoid regenerate ขณะ render)

### 5.3 Watering Cooldown
```ts
function canWater(tree: TreeInstance, now: number): boolean {
  if (!tree.lastWateredAt) return true;
  return now - tree.lastWateredAt >= 30 * 60 * 1000;
}
```
UI แสดง countdown timer (re-render ทุกวินาที ผ่าน `setInterval` + Zustand tick). ตอน resume จาก background ให้คำนวณจาก `Date.now()` ไม่ใช่ timer drift

### 5.4 Harvest Flow
```
onWater(tree):
  if !canWater(tree, now): toast "wait X min"; return
  tree.currentWaterings++
  tree.lastWateredAt = now
  if tree.currentWaterings >= tree.requiredWaterings:
    tree.harvestedAt = now
    playerState.collection.push(tree)
    playerState.activeTree = null
    playerState.stats.totalHarvested++
    showHarvestAnimation()
  saveStore.persist(playerState)
```

---

## 6. API / Module Contracts

### 6.1 SaveStore (abstraction เพื่อให้สลับ backend ได้)
```ts
interface SaveStore {
  load(): Promise<PlayerState | null>;
  save(state: PlayerState): Promise<void>;
  clear(): Promise<void>;
}

class LocalSaveStore implements SaveStore { ... }   // v1
class CloudSaveStore implements SaveStore { ... }   // v2
class CompositeSaveStore implements SaveStore { ... } // local-first + async cloud push
```

### 6.2 Game Actions (Zustand store)
```ts
interface GameActions {
  plantTree(): TreeInstance;          // throws if activeTree != null
  waterTree(): WaterResult;           // { ok, nextAvailableAt?, harvested? }
  getCollection(): TreeInstance[];
  getUnlockedSpeciesCount(): number;  // out of 300
  resetProgress(): void;              // dev / settings
}
```

### 6.3 (Future v2) Cloud API
```
POST /auth/login        { provider, token } → { sessionToken }
GET  /save              → { blob: base64(gzip(PlayerState)), updatedAt }
PUT  /save              { blob, clientUpdatedAt } → { ok, serverUpdatedAt }
                        409 if serverUpdatedAt > clientUpdatedAt (conflict)
```
**Conflict resolution**: last-writer-wins by `updatedAt` ใน MVP cloud. Merge strategy (union collection, max stats) สำหรับ v2.1

---

## 7. UI / UX (Mobile-first)

### 7.1 Screens
1. **Home / Plot View** (default)
   - 3D scene: ground + active tree (หรือ empty plot)
   - ปุ่มใหญ่กลาง-ล่าง: "Plant" (ถ้าว่าง) หรือ "Water" (ถ้ามีต้น)
   - Progress: "3 / 7 waterings"
   - Cooldown timer ถ้ายังรดไม่ได้
2. **Gallery (Achievement)**
   - Header stats: `Harvested: 124` · `Species unlocked: 47 / 300`
   - Grid thumbnails (ต้นละ 1 thumbnail — render offscreen ตอน harvest แล้ว cache เป็น data URL)
   - แต่ละ card แสดง: thumbnail, species name, rarity badge (สีตาม tier), วันที่เก็บ
   - Slot ที่ยังไม่ปลดล็อก → silhouette สีเทา + "???"
   - Filter / sort: by rarity, by date, by species
   - Tap card → **Detail View** (fullscreen)
     - 3D interactive render (orbit controls, pinch-zoom, auto-rotate)
     - Metadata: species, rarity, seed, planted/harvested dates, waterings count
     - ปุ่ม Share (future) + Back
3. **Settings**: sound, haptics, reduced motion, export/import JSON, reset

### 7.2 Interactions
- **Water**: tap ปุ่ม + subtle haptic + water droplet particles + growth animation
- **Plant**: swipe up / button, มี seed animation (เมล็ดตกแล้วงอก)
- **Harvest**: full-screen reveal animation — rarity-tier glow color (common: ขาว, rare: ฟ้า, legendary: ทอง)

### 7.3 Accessibility
- Reduced motion toggle → ปิด particle/growth animation
- Button สูง ≥ 44pt, color contrast AA
- Screen reader labels สำหรับ tree state

---

## 8. Rendering Strategy

- **Scene budget**: ≤ 50k triangles per tree, ≤ 8 draw calls ใน plot view
- ใช้ `InstancedMesh` สำหรับใบไม้ (1 mesh × N instances ต่อต้น)
- **Thumbnail cache**: render ต้นไม้ขนาด 256×256 ใน offscreen canvas ตอน harvest → เก็บเป็น data URL ใน collection item → ไม่ต้อง render ทุกต้นใน grid
- **Adaptive quality**: ตรวจ `devicePixelRatio`, GPU tier (via `detect-gpu`) → ลด iterations L-system หรือ pixel ratio ถ้ามือถือเก่า
- **Throttle**: หยุด render loop เมื่อ tab hidden (`visibilitychange`)

---

## 9. Scale & Reliability

### 9.1 Client
- LocalStorage quota: 5–10 MB; ใช้ < 100 KB → ปลอดภัย
- 300 species geometries: generate on-demand + LRU cache (in-memory) 20 ล่าสุด
- Crash recovery: เขียน save ทุกครั้งที่ state mutate (debounced 500ms); มี `schemaVersion` สำหรับ migration

### 9.2 Cloud (future)
- Save blob ขนาด ~10–50 KB gzipped ต่อผู้เล่น
- API stateless → scale horizontally ง่าย
- Storage: Postgres `users(id, email, ...)` + `save_blobs(user_id PK, blob BYTEA, updated_at)`
- Estimated: 100k users × 50 KB = 5 GB — ใช้ managed Postgres / Supabase เพียงพอ
- Rate limit: PUT /save 1 req / 30s per user

### 9.3 Monitoring (v2)
- Client: Sentry สำหรับ JS errors, basic analytics (plant/water/harvest events)
- Server: request latency, error rate, save size p99

---

## 10. Security & Privacy (future cloud)

- Auth: OAuth (Google/Apple) หรือ magic link (ไม่ต้องเก็บ password)
- PII ต่ำ: เก็บแค่ email + userId
- Save blob ไม่ sensitive แต่ encrypt-at-rest (managed by DB)
- CSRF: ใช้ Authorization: Bearer token
- No secrets ฝั่ง client

---

## 11. Trade-offs & Decisions

| Decision | Chosen | Alternative | Trade-off |
|---|---|---|---|
| Tree gen | Seed + L-system | 300 hand-made templates | ทำได้ unique ต้นไม่จำกัด, เขียนครั้งเดียว; แต่ควบคุม aesthetic ยากกว่า |
| Rarity model | 3 tiers (200/80/20) | Flat random | มี chase mechanic + ความตื่นเต้น; ต้อง balance drop rate |
| Cooldown | Strict 30 min | Accumulate window | ง่ายต่อความเข้าใจและ implement; user ที่ active ช่วงสั้นเสียโอกาส |
| Renderer | Three.js low-poly | Full-PBR 3D / 2D SVG | สมดุลระหว่างสวยและเร็วบนมือถือ |
| State | Zustand | Redux / Context | โค้ดน้อย, performance ดี, ไม่ต้อง boilerplate |
| Storage | localStorage (+ schema version) | IndexedDB | ขนาดข้อมูลเล็กพอ, API ง่าย; IDB overkill สำหรับ <1MB |
| Sync | last-writer-wins (v2) | CRDT merge | MVP เร็ว; อาจเสียข้อมูลถ้าใช้หลายเครื่องพร้อมกัน |
| One tree at a time | ✅ | Multi-plot garden | UI/UX เรียบง่าย, engagement ต่อ session สั้น |

---

## 12. What I'd Revisit as the System Grows

1. **Multi-plot / garden**: ถ้า engagement ต่อ session สั้นเกินไป ควรมีต้นไม้หลายต้นขนานกัน
2. **Daily streak / login bonus**: เพิ่ม retention
3. **Sharing**: screenshot ต้นไม้ + share link (seed-based URL → ใครเปิดก็เห็นต้นเดียวกัน)
4. **Cross-device sync**: อาจต้องยก save model → CRDT หรือ operational log แทน blob
5. **Species progression**: ปลดล็อก species rare/legendary เฉพาะหลัง milestone (เช่น ปลูกครบ 20 common แล้วถึงเริ่มมีโอกาส rare)
6. **Content pipeline**: ถ้าอยากเพิ่ม species เกิน 300 ต้อง ship OTA JSON แทน bundle

---

## 13. MVP Milestones (suggested)

| Week | Deliverable |
|---|---|
| 1 | Vite + React + Three.js skeleton, L-system renderer ต้นเดียว |
| 2 | Seed + species table 20 species (5 per rarity MVP), plant/water/harvest logic |
| 3 | Collection screen + thumbnail cache, localStorage + schemaVersion |
| 4 | PWA manifest, polishing animations, mobile testing, launch |
| +2 wk | Auth + cloud save (v2) |

---

## 14. Gallery Data Contract (clarified)

```ts
interface GalleryView {
  totalHarvested: number;           // นับทุกต้นที่เคยเก็บ (duplicates นับด้วย)
  uniqueSpeciesUnlocked: number;    // distinct speciesId — max 300
  items: GalleryItem[];             // sorted by harvestedAt desc (default)
}

interface GalleryItem {
  treeId: string;
  speciesId: number;
  speciesName: string;
  rarity: Rarity;
  seed: number;
  thumbnailDataUrl: string;         // 256x256 offscreen snapshot
  plantedAt: number;
  harvestedAt: number;
  waterings: number;                // = requiredWaterings ตอน harvest
}
```

**คำถาม (default ถ้ายังไม่ clarify):**
- ถ้า user เก็บต้น species เดียวกันซ้ำ → แสดงแยกเป็นหลาย card (ต่างกันที่ seed = หน้าตาต่างกันจริง)
- Species progress `47/300` นับ **distinct speciesId** เท่านั้น

---

## 15. Open Questions (ยังไม่ได้ตัดสินใจ — รอ product)

1. ตอนเปิด app ค้างไว้แล้ว cooldown ครบ จะ notify ยังไง? (in-app toast พอไหม หรือทำ web push?)
2. ระหว่าง cooldown ยังให้ interact กับต้น (หมุน/ซูม) ได้ใช่ไหม? — สมมติว่าได้
3. ถ้า user กด reset progress จะรีเซ็ตทั้ง collection หรือแค่ active tree?
4. Achievement page อยากมี "progress streak" หรือ stats เพิ่มไหม (e.g. ปลูกติดกันกี่วัน)?
5. Sound/music — มี budget designer เสียงหรือหาใน CC0?

ถ้าเคลียร์หัวข้อพวกนี้แล้วพร้อมเริ่ม scaffold โค้ดได้เลยครับ
