# Step 03 — Data Model & Save Store

**Goal:** มี TypeScript types ครบ, SaveStore abstraction พร้อม localStorage adapter, migration framework, และ seed data สำหรับ 300 species

**Estimated time:** 2–3 ชม.

---

## 3.1 Core Types (`src/types/game.ts`)

```ts
export type Rarity = 'common' | 'rare' | 'legendary';

export interface TreeInstance {
  id: string;                  // nanoid()
  seed: number;                // uint32 — deterministic geometry
  speciesId: number;           // 0..299
  rarity: Rarity;              // denormalized จาก species table
  requiredWaterings: number;   // 1..10 — fixed at plant time
  currentWaterings: number;    // 0..requiredWaterings
  plantedAt: number;           // epoch ms
  lastWateredAt: number | null;
  harvestedAt: number | null;  // null ถ้ายังไม่ harvest
  thumbnailDataUrl?: string;   // ใส่ตอน harvest — 256x256 PNG data URL
}

export interface StreakState {
  currentStreak: number;       // วันติดต่อกันล่าสุด
  longestStreak: number;
  lastCheckinDate: string;     // 'YYYY-MM-DD' ใน local timezone
}

export interface PlayerStats {
  totalPlanted: number;
  totalWatered: number;
  totalHarvested: number;
}

export interface PlayerState {
  schemaVersion: 1;
  userId: string;              // local nanoid; ผูกกับ cloud account ภายหลัง
  createdAt: number;
  updatedAt: number;           // last-writer-wins สำหรับ cloud sync
  activeTree: TreeInstance | null;
  collection: TreeInstance[];  // harvested, append-only
  stats: PlayerStats;
  streak: StreakState;
}

export interface Settings {
  sound: boolean;
  haptics: boolean;
  reducedMotion: boolean;
  notifications: boolean;      // web push opt-in
}
```

## 3.2 Species Table (`src/data/species.ts`)

```ts
import type { Rarity } from '@/types/game';

export interface SpeciesDef {
  id: number;
  name: string;
  rarity: Rarity;
  lSystem: {
    axiom: string;
    rules: Record<string, string>;
    iterations: number;        // 3..6
    angleBase: number;         // deg
    lengthBase: number;
    thicknessBase: number;
    leafColor: [number, number, number];   // HSL [0-360, 0-1, 0-1]
    trunkColor: [number, number, number];
  };
}

// 300 species ทั้งหมด — ดู step 04 สำหรับวิธี generate table นี้
export const SPECIES: SpeciesDef[] = [/* ... populated in step 04 ... */];

export const SPECIES_BY_RARITY: Record<Rarity, SpeciesDef[]> = {
  common:    SPECIES.filter(s => s.rarity === 'common'),     // 200
  rare:      SPECIES.filter(s => s.rarity === 'rare'),       // 80
  legendary: SPECIES.filter(s => s.rarity === 'legendary'),  // 20
};
```

## 3.3 SaveStore Abstraction

```ts
// src/store/saveStore.ts
import type { PlayerState } from '@/types/game';
import { STORAGE_KEY } from '@/config/constants';
import { migrate } from './migrations';

export interface SaveStore {
  load(): Promise<PlayerState | null>;
  save(state: PlayerState): Promise<void>;
  clear(): Promise<void>;
}

export class LocalSaveStore implements SaveStore {
  async load(): Promise<PlayerState | null> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { schemaVersion: number } & Record<string, unknown>;
      return migrate(parsed);
    } catch (err) {
      console.error('[SaveStore] load failed', err);
      return null;
    }
  }

  async save(state: PlayerState): Promise<void> {
    const payload = { ...state, updatedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Singleton export
export const saveStore: SaveStore = new LocalSaveStore();
```

### Debounced save helper
```ts
// src/store/debouncedSave.ts
import { saveStore } from './saveStore';
import type { PlayerState } from '@/types/game';

let timer: number | null = null;
export function scheduleSave(state: PlayerState, delayMs = 500) {
  if (timer) window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    saveStore.save(state).catch(console.error);
    timer = null;
  }, delayMs);
}
```

## 3.4 Migration Framework (`src/store/migrations.ts`)

```ts
import type { PlayerState } from '@/types/game';
import { SCHEMA_VERSION } from '@/config/constants';

type UnknownState = { schemaVersion: number } & Record<string, unknown>;

export function migrate(state: UnknownState): PlayerState {
  let s = state;
  // Each migration bumps one version at a time
  // if (s.schemaVersion === 0) s = migrateV0toV1(s);
  // if (s.schemaVersion === 1) s = migrateV1toV2(s);
  if (s.schemaVersion !== SCHEMA_VERSION) {
    console.warn(`[migrate] unknown schemaVersion ${s.schemaVersion}, falling back`);
  }
  return s as unknown as PlayerState;
}
```

ตั้งใจเขียน pattern นี้ตั้งแต่แรก เพื่อไม่ให้ข้อมูล user เสียตอน ship update

## 3.5 Initial State Factory

```ts
// src/store/initialState.ts
import { nanoid } from 'nanoid';
import type { PlayerState } from '@/types/game';
import { SCHEMA_VERSION } from '@/config/constants';

export function createInitialState(): PlayerState {
  const now = Date.now();
  return {
    schemaVersion: SCHEMA_VERSION,
    userId: nanoid(),
    createdAt: now,
    updatedAt: now,
    activeTree: null,
    collection: [],
    stats: { totalPlanted: 0, totalWatered: 0, totalHarvested: 0 },
    streak: { currentStreak: 0, longestStreak: 0, lastCheckinDate: '' },
  };
}
```

## 3.6 Settings Store (แยกจาก game state)

```ts
// src/store/settingsStore.ts
import { SETTINGS_KEY } from '@/config/constants';
import type { Settings } from '@/types/game';

const defaults: Settings = {
  sound: true,
  haptics: true,
  reducedMotion: false,
  notifications: false,
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch { return defaults; }
}

export function saveSettings(s: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}
```

## 3.7 Size Budget

ประมาณการขนาด save blob:
- PlayerState (ไม่รวม thumbnails): ~2 KB
- Thumbnail 256×256 PNG data URL: ~15–25 KB × 300 = **max 7.5 MB**

⚠️ **7.5 MB เกิน localStorage quota** — แก้โดยเก็บ thumbnail แยกใน **IndexedDB** หรือ regenerate on-demand

### Decision: regenerate thumbnails on-demand
- ไม่เก็บ `thumbnailDataUrl` ใน PlayerState
- ตอน render Gallery grid → generate thumbnail จาก `speciesId + seed` (deterministic!)
- Cache ใน-memory ด้วย LRU (ลบ field `thumbnailDataUrl` ออกจาก TreeInstance ได้)

**แก้ types:**
```ts
export interface TreeInstance {
  // ... (ลบ thumbnailDataUrl field ออก)
}
```

→ save blob เล็กลงเหลือ ~60 KB max ที่ 300 ต้น ✅

## ✅ Definition of Done
- [ ] `types/game.ts` compile ผ่าน strict mode
- [ ] `SaveStore` interface + `LocalSaveStore` implementation
- [ ] Load → save → load ได้ข้อมูลเดิม
- [ ] Debounced save ทำงาน (ไม่เขียน localStorage ทุก keystroke)
- [ ] Migration framework พร้อมรับ schemaVersion เพิ่ม
- [ ] `createInitialState()` สร้าง state ที่ valid
- [ ] Settings store แยกต่างหาก
- [ ] Unit test: save → load round-trip (step 09)

ถัดไป → [`04-tree-generator.md`](./04-tree-generator.md)
