# Step 07 — Screens & UI Layout

**Goal:** UI minimal สุด — 3D ต้นไม้เต็มจอ, icon buttons กองอยู่มุมบนทั้ง 2 ฝั่ง, ปุ่ม action ใหญ่เดียวกลางล่าง ไม่มี chrome อื่น

**Estimated time:** 2–3 วัน

**Design principle:** *โชว์ต้นไม้ให้มากที่สุด UI อื่นต้องจางและหลบ*

---

## 7.1 Home Screen — Layout (final spec)

```
┌─────────────────────────────────┐
│ ┌──┐                      ┌──┐  │  ← TL: Gallery    TR: Florist Card
│ │🖼│                      │🌼│  │     (primary 44px)
│ └──┘                      └──┘  │
│                            ┌─┐  │  ← TR below: Login (Coming Soon)
│                            │👤│  │     (secondary 36px, muted)
│                            └─┘  │
│                                 │
│             🌳                  │  ← ต้นไม้ 3D เต็มกลางจอ
│           (Three.js)            │     โตตาม % + orbit/pinch-zoom
│                                 │
│                                 │
│            42%                  │  ← growth progress (เฉพาะตอนปลูก)
│       ┌─────────────────┐       │
│       │      รดน้ำ      │       │  ← ปุ่มเดียว (toggle)
│       └─────────────────┘       │
│         ⏳ 12:34 cooldown        │  ← subtitle ใต้ปุ่ม (ถ้ามี)
└─────────────────────────────────┘
```

### Icons — มี 3 ปุ่มเท่านั้น

| ตำแหน่ง | ลำดับ | Icon | ทำอะไร |
|---|---|---|---|
| Top-Left | primary (44) | Gallery (frame icon) | ไปหน้า Gallery ดูคอลเลกชันต้นไม้ |
| Top-Right บน | primary (44) | Florist Card (flower icon) | เปิดการ์ดโชว์ความสำเร็จ — overview จำนวนต้นที่ปลูก, species unlocked, streak, rarity breakdown |
| Top-Right ล่าง | secondary (36, muted) | Login (user icon) | **Coming Soon** — แตะแล้วแสดง toast "เร็วๆ นี้ จะได้ sync ต้นไม้ข้ามเครื่อง" |

> **หมายเหตุ:** ถ้าในอนาคต Login ทำงานจริง ให้ย้ายไปหน้า Settings / modal login เดิม และเอา pin "Coming Soon" ออก

### ปุ่มกลางล่าง (single main action — toggle)

ปุ่มเดียวสลับ label/action ตาม state ของเกม:

| State | Label | สี | Disabled | Subtitle |
|---|---|---|---|---|
| `activeTree == null` | **เริ่มปลูก** | clay-500 | no | — |
| `activeTree && canWater()` | **รดน้ำ** | clay-500 | no | — |
| `activeTree && !canWater()` | **รดน้ำ** | clay-500 (opacity-60) | yes | `⏳ mm:ss` (live countdown) |

**Growth percent** แสดงเป็น text เล็กๆ **เหนือปุ่ม** เฉพาะเมื่อมี `activeTree`:
```ts
const percent = Math.round((tree.currentWaterings / tree.requiredWaterings) * 100);
// แสดงเป็น "42%"
```
ไม่แสดง `X / Y` ครั้ง เพื่อ:
- เน้นความรู้สึก "ต้นกำลังโต" มากกว่า "นับครั้ง"
- Hide `requiredWaterings` ออกจากสายตา → ผู้เล่นไม่รู้ล่วงหน้าว่าต้องกี่ครั้ง → สร้าง surprise เมื่อเก็บเกี่ยว
- UI เรียบขึ้น ตัวเลขน้อยลง

**ไม่มี chrome อื่น** — ไม่มี header, title, navbar, settings gear, shovel, streak badge ในหน้านี้ (ฟีเจอร์พวกนั้นย้ายไปอยู่ใน Florist Card / Gallery / Settings screen แทน)

## 7.2 Home Component (`src/screens/PlotView.tsx`)

```tsx
import { Scene } from '@/three/Scene';
import { useGameStore } from '@/store/gameStore';
import { Button } from '@/components/Button';
import { CountdownTimer } from '@/components/CountdownTimer';
import { CornerButton } from '@/components/CornerButton';
import { GalleryIcon, FloristCardIcon, UserIcon } from '@/components/icons';
import { FloristCardSheet } from '@/components/FloristCardSheet';
import { useState } from 'react';
import { toast } from '@/lib/toast';

export function PlotView() {
  const tree      = useGameStore(s => s.state.activeTree);
  const canWater  = useGameStore(s => s.canWater());
  const nextAt    = useGameStore(s => s.nextWaterAt());
  const water     = useGameStore(s => s.waterTree);
  const plant     = useGameStore(s => s.plantTree);
  const [showCard, setShowCard] = useState(false);

  return (
    <div className="relative h-[100dvh] w-full bg-cream-50 overflow-hidden">
      {/* 3D Scene fills the screen */}
      <div className="absolute inset-0">
        <Scene />
      </div>

      {/* ─── TOP-LEFT: Gallery ─────────────────────── */}
      <div
        className="absolute top-0 left-0 pl-4 pointer-events-none"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
        <CornerButton to="/gallery" label="Gallery" size="primary">
          <GalleryIcon />
        </CornerButton>
      </div>

      {/* ─── TOP-RIGHT: Florist Card + Login (Coming Soon) ── */}
      <div
        className="absolute top-0 right-0 flex flex-col items-end gap-2 pr-4 pointer-events-none"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
        <CornerButton
          onClick={() => setShowCard(true)}
          label="Florist Card"
          size="primary"
        >
          <FloristCardIcon />
        </CornerButton>

        <CornerButton
          onClick={() => toast('เร็วๆ นี้ — จะได้ sync ต้นไม้ข้ามเครื่อง')}
          label="Login (Coming Soon)"
          size="secondary"
          comingSoon
        >
          <UserIcon />
        </CornerButton>
      </div>

      {/* ─── BOTTOM CENTER ACTION ──────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center pointer-events-none"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
      >
        <div className="pointer-events-auto flex flex-col items-center gap-2">
          {tree && (
            <div className="text-xs text-ink-500 tracking-wider font-medium tabular-nums">
              {Math.round((tree.currentWaterings / tree.requiredWaterings) * 100)}%
            </div>
          )}

          {!tree ? (
            <Button size="lg" onClick={() => plant()} className="min-w-[240px]">
              เริ่มปลูก
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => water()}
              disabled={!canWater}
              className={`min-w-[240px] ${!canWater ? 'opacity-60' : ''}`}
            >
              รดน้ำ
            </Button>
          )}

          {tree && !canWater && nextAt && (
            <div className="text-sm text-ink-500 mt-1">
              ⏳ <CountdownTimer until={nextAt} />
            </div>
          )}
        </div>
      </div>

      <FloristCardSheet open={showCard} onClose={() => setShowCard(false)} />
    </div>
  );
}
```

**Layout notes:**
- ทุก overlay ใช้ `pointer-events-none` บน container + `pointer-events-auto` บนตัวปุ่ม → drag/pinch ต้นไม้ผ่าน gap ระหว่างปุ่มได้
- ใช้ `100dvh` แทน `100vh` เพื่อเลี่ยง bug URL bar บน mobile Safari
- Safe area insets ใช้ทั้ง top และ bottom — ไม่ชน notch / home indicator

## 7.3 CornerButton Component

```tsx
// src/components/CornerButton.tsx
import Link from 'next/link';
import { clsx } from 'clsx';

interface Props {
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
  label: string;
  size?: 'primary' | 'secondary';
  comingSoon?: boolean;              // แสดง lock dot + tooltip hint
  children: React.ReactNode;
}

export function CornerButton({
  to, onClick, disabled, label,
  size = 'primary', comingSoon, children,
}: Props) {
  const cls = clsx(
    'relative pointer-events-auto rounded-full',
    'bg-cream-50/80 backdrop-blur-sm border border-cream-300',
    'flex items-center justify-center text-ink-700',
    'shadow-soft-sm transition-all duration-150',
    'active:scale-95',
    size === 'primary'   && 'h-11 w-11',          // 44px
    size === 'secondary' && 'h-9 w-9 opacity-70', // 36px, จาง
    comingSoon && 'grayscale',                    // ดูล็อกแต่ยังแตะได้เพื่อโชว์ toast
    disabled && 'opacity-40 pointer-events-none',
  );

  const dot = comingSoon && (
    <span
      className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-clay-500 ring-2 ring-cream-50"
      aria-hidden
    />
  );

  const inner = (
    <>
      <span aria-label={label}>{children}</span>
      {dot}
    </>
  );

  if (to) return <Link href={to} className={cls} aria-label={label}>{inner}</Link>;
  return (
    <button onClick={onClick} className={cls} disabled={disabled} aria-label={label}>
      {inner}
    </button>
  );
}
```

## 7.4 SVG Icons

```tsx
// src/components/icons.tsx
// ทุก icon ใช้ stroke="currentColor" เพื่อรับสีจาก parent (warm ink-700)

export function GalleryIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M21 16 L15 11 L5 20" />
    </svg>
  );
}

export function FloristCardIcon({ size = 22 }: { size?: number }) {
  // flower card — สื่อถึง achievement trophy card
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="10" r="1.6" />
      <path d="M12 6.5 A2.2 2.2 0 0 1 14.2 8.7" />
      <path d="M12 6.5 A2.2 2.2 0 0 0 9.8 8.7" />
      <path d="M15.5 10 A2.2 2.2 0 0 1 13.3 12.2" />
      <path d="M8.5 10 A2.2 2.2 0 0 0 10.7 12.2" />
      <path d="M8 16 H16" />
      <path d="M8 18.5 H13" />
    </svg>
  );
}

export function UserIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21" />
    </svg>
  );
}

export function WaterDropIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 C 12 3 5 11 5 15 A7 7 0 0 0 19 15 C 19 11 12 3 12 3 Z" />
    </svg>
  );
}
```

## 7.5 Florist Card Sheet

> ⚠️ **Superseded by [`11-florist-card.md`](./11-florist-card.md).** The sketch below is kept for context — the passport visual, share image pipeline, and Web Share fallback are fully specified in the new step. Treat §7.5 as legacy notes, not the source of truth.

Bottom sheet / modal ที่โชว์ **ความสำเร็จรวม** ของผู้เล่น เหมือนการ์ดประจำตัวนักจัดสวน

### Content

```
┌─────────────────────────────────────┐
│  🌼 Florist Card                  ✕ │
├─────────────────────────────────────┤
│                                     │
│   Zeze                              │
│   นักจัดสวนระดับ: Apprentice         │ ← derived จาก species unlocked
│                                     │
│   ┌────────┬────────┬────────┐      │
│   │   47   │  124   │   12   │      │
│   │Species │ Total  │ Streak │      │
│   │unlocked│harvest │  🔥    │      │
│   └────────┴────────┴────────┘      │
│                                     │
│   Rarity collected                  │
│   Common     ████████░░  38 / 200   │
│   Rare       ███░░░░░░░   8 /  80   │
│   Legendary  █░░░░░░░░░   1 /  20   │
│                                     │
│   Longest streak: 23 วัน            │
│   Started: 12 Jan 2026              │
│                                     │
│       [ ดู Gallery ทั้งหมด → ]      │
└─────────────────────────────────────┘
```

### Data contract

```ts
interface FloristCardData {
  displayName: string;         // "Guest" จนกว่าจะ login
  rank: FloristRank;           // derived: Seedling / Apprentice / Gardener / Master / Legend
  speciesUnlocked: number;     // distinct speciesId
  totalHarvested: number;
  currentStreak: number;
  longestStreak: number;
  rarityProgress: {
    common:    { unlocked: number; total: 200 };
    rare:      { unlocked: number; total:  80 };
    legendary: { unlocked: number; total:  20 };
  };
  startedAt: number;           // playerState.createdAt
}

// Rank derivation (tunable)
function deriveRank(unlocked: number): FloristRank {
  if (unlocked >= 250) return 'Legend';
  if (unlocked >= 150) return 'Master';
  if (unlocked >= 75)  return 'Gardener';
  if (unlocked >= 20)  return 'Apprentice';
  return 'Seedling';
}
```

### Component skeleton

```tsx
// src/components/FloristCardSheet.tsx
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'next/navigation';

export function FloristCardSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const data = useGameStore(s => s.selectFloristCard());  // memoized selector
  const router = useRouter();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-cream-50 rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-2xl text-ink-900">Florist Card</h2>
          <button onClick={onClose} aria-label="Close" className="text-ink-500 text-2xl leading-none">✕</button>
        </div>

        <p className="text-ink-700">{data.displayName}</p>
        <p className="text-sm text-ink-500 mb-5">นักจัดสวนระดับ: <span className="text-clay-600 font-medium">{data.rank}</span></p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Stat label="Species" value={`${data.speciesUnlocked}/300`} />
          <Stat label="Harvested" value={data.totalHarvested} />
          <Stat label="🔥 Streak" value={`${data.currentStreak}d`} />
        </div>

        <RarityBar rarity="common"    {...data.rarityProgress.common} />
        <RarityBar rarity="rare"      {...data.rarityProgress.rare} />
        <RarityBar rarity="legendary" {...data.rarityProgress.legendary} />

        <div className="mt-4 text-xs text-ink-500">
          Longest streak: {data.longestStreak} วัน · Started: {formatDate(data.startedAt)}
        </div>

        <Button
          variant="secondary"
          className="w-full mt-5"
          onClick={() => { onClose(); router.push('/gallery'); }}
        >
          ดู Gallery ทั้งหมด →
        </Button>
      </div>
    </div>
  );
}
```

**Design notes:**
- เปิดเป็น bottom sheet บน mobile, center modal บน desktop
- พื้นหลัง `cream-50` คงโทน warm off-white
- Rarity bar สีตาม tier: common = cream-400, rare = leaf-400, legendary = clay-500
- Tap พื้นที่นอกการ์ด → ปิด

## 7.6 Streak Popover

```tsx
function StreakButton() {
  const [open, setOpen] = useState(false);
  const streak = useGameStore(s => s.state.streak);
  return (
    <div className="relative">
      <CornerButton onClick={() => setOpen(v => !v)} label="Streak"><FlameIcon /></CornerButton>
      {open && (
        <Card className="absolute top-14 right-0 p-4 min-w-[180px] z-40">
          <div className="text-2xl font-serif">🔥 {streak.currentStreak}</div>
          <div className="text-xs text-ink-500 mt-1">วันติดต่อกัน</div>
          <div className="text-xs text-ink-500 mt-2">สถิติสูงสุด: {streak.longestStreak} วัน</div>
        </Card>
      )}
    </div>
  );
}
```

## 7.7 Gallery Screen (`src/screens/GalleryView.tsx`)

> Mounted by `src/app/gallery/page.tsx`:
> ```tsx
> 'use client';
> import { GalleryView } from '@/screens/GalleryView';
> export default function Page() { return <GalleryView />; }
> ```

```tsx
'use client';
import { useGameStore } from '@/store/gameStore';
import Link from 'next/link';
import { RarityBadge } from '@/components/RarityBadge';
import { renderThumbnail } from '@/three/thumbnailRenderer';
import { SPECIES } from '@/data/species';
import { TOTAL_SPECIES } from '@/config/constants';

export function Gallery() {
  const collection = useGameStore(s => s.state.collection);
  const unlocked = useGameStore(s => s.uniqueSpeciesUnlocked());
  const sorted = [...collection].sort((a, b) => (b.harvestedAt ?? 0) - (a.harvestedAt ?? 0));

  return (
    <div className="min-h-[100dvh] bg-cream-50 safe-top safe-bottom px-4 pb-24">
      <header className="flex items-center justify-between py-4">
        <Link href="/" className="text-ink-700">← กลับ</Link>
        <h1 className="text-xl font-serif">Gallery</h1>
        <div className="w-10" />
      </header>

      <section className="grid grid-cols-2 gap-3 text-center my-4">
        <Card className="p-3">
          <div className="text-3xl font-serif text-ink-900">{collection.length}</div>
          <div className="text-xs text-ink-500 mt-1">เก็บแล้ว</div>
        </Card>
        <Card className="p-3">
          <div className="text-3xl font-serif text-ink-900">{unlocked} / {TOTAL_SPECIES}</div>
          <div className="text-xs text-ink-500 mt-1">species ปลดล็อก</div>
        </Card>
      </section>

      <div className="grid grid-cols-3 gap-3">
        {sorted.map(tree => (
          <Link key={tree.id} href={`/gallery/${tree.id}`} className="group">
            <Card className="overflow-hidden aspect-square relative">
              <img
                src={renderThumbnail(tree.speciesId, tree.seed)}
                alt={SPECIES[tree.speciesId]?.name ?? ''}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-1 right-1">
                <RarityBadge rarity={tree.rarity} />
              </div>
            </Card>
            <div className="text-xs mt-1 text-ink-700 truncate">
              {SPECIES[tree.speciesId]?.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

**Note:** `renderThumbnail` สังเกตว่าจะ block main thread ~50-100ms ต่อต้น. แนะนำ:
- Render lazy แบบ `IntersectionObserver` → render เฉพาะ card ที่ visible
- หรือใช้ web worker + OffscreenCanvas (future optimization)

## 7.8 Detail View (`src/screens/DetailView.tsx`)

> Mounted by `src/app/gallery/[id]/page.tsx`:
> ```tsx
> 'use client';
> import { use } from 'react';
> import { DetailView } from '@/screens/DetailView';
> export default function Page({ params }: { params: Promise<{ id: string }> }) {
>   const { id } = use(params);
>   return <DetailView id={id} />;
> }
> ```
> *Next.js 16 / React 19: `params` เป็น Promise ใน client component ต้องใช้ `use()` unwrap*

```tsx
'use client';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { SPECIES } from '@/data/species';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { TreeMesh } from '@/three/ActiveTreeMesh';  // reused
import { RarityBadge } from '@/components/RarityBadge';

export function DetailView({ id }: { id: string }) {
  const tree = useGameStore(s => s.state.collection.find(t => t.id === id));
  if (!tree) return <div>ไม่พบ</div>;
  const species = SPECIES[tree.speciesId]!;

  return (
    <div className="min-h-[100dvh] bg-cream-50 flex flex-col safe-top safe-bottom">
      <header className="flex items-center justify-between px-4 py-3">
        <Link href="/gallery" className="text-ink-700">← กลับ</Link>
        <RarityBadge rarity={tree.rarity} />
      </header>

      <div className="flex-1 relative">
        <Canvas camera={{ position: [3, 2, 4], fov: 40 }}>
          <ambientLight intensity={0.6} color="#F0DFC4" />
          <directionalLight intensity={1.1} color="#FFE8C8" position={[5, 8, 3]} />
          <TreeMesh speciesId={tree.speciesId} seed={tree.seed} progress={1} />
          <OrbitControls autoRotate autoRotateSpeed={0.4} enablePan={false} />
        </Canvas>
      </div>

      <div className="p-4 bg-cream-100 border-t border-cream-300">
        <h2 className="text-2xl font-serif mb-1">{species.name}</h2>
        <div className="text-sm text-ink-500 space-y-1">
          <div>Seed: <span className="font-mono">{tree.seed}</span></div>
          <div>รดน้ำทั้งหมด: {tree.requiredWaterings} ครั้ง</div>
          <div>ปลูก: {new Date(tree.plantedAt).toLocaleDateString('th-TH')}</div>
          <div>เก็บ: {new Date(tree.harvestedAt!).toLocaleDateString('th-TH')}</div>
        </div>
      </div>
    </div>
  );
}
```

## 7.9 Settings Screen (`src/screens/Settings.tsx`)

- Toggles: sound, haptics, reduced motion, notifications (web push opt-in)
- Export / Import JSON save
- Danger zone: "รีเซ็ตทั้งหมด" (double-confirm)

## 7.10 Routing (Next.js App Router)

ใช้ Next.js App Router — routes ถูก define ผ่าน folder structure ใน `src/app/`:

```
src/app/
├── layout.tsx                      # Root layout — theme, fonts, <StoreHydrator>
├── page.tsx                        # /          → <PlotView />
├── gallery/
│   ├── page.tsx                    # /gallery   → <GalleryView />
│   └── [id]/
│       └── page.tsx                # /gallery/[id] → <DetailView id={id} />
└── settings/
    └── page.tsx                    # /settings  → <SettingsView />
```

### Hydration pattern (replace react-router `useEffect` hydrate)

เพราะ Zustand store ต้อง hydrate จาก localStorage หลัง mount (SSR-safe) ให้ใส่ hydrator ใน root layout:

```tsx
// src/app/layout.tsx
import { StoreHydrator } from '@/store/StoreHydrator';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-cream-50 text-ink-900 antialiased">
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}
```

```tsx
// src/store/StoreHydrator.tsx
'use client';
import { useEffect } from 'react';
import { useGameStore } from './gameStore';

export function StoreHydrator() {
  const hydrate = useGameStore(s => s.hydrate);
  useEffect(() => { hydrate(); }, [hydrate]);
  return null;
}
```

### Navigation imperative
```ts
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/gallery');   // แทน nav('/gallery')
router.back();             // แทน nav(-1)
```

### Static params generation (สำหรับ Detail route)

เพราะใช้ `output: 'export'` dynamic routes ต้อง generate static params ตอน build หรือให้ fallback ที่ runtime. เนื่องจาก `id` ของต้นไม้เป็น uuid สุ่มของผู้ใช้ ไม่สามารถรู้ล่วงหน้าได้ → ใช้ **`dynamicParams: true` + `generateStaticParams` คืน array ว่าง**:

```tsx
// src/app/gallery/[id]/page.tsx
export const dynamic = 'force-static';
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];   // empty — Next จะ generate บน demand ฝั่ง client
}
```

หรือทางเลือกที่ง่ายกว่า: ใช้ **single page `/gallery/detail/?id=xxx`** แทน dynamic route เพื่อหลีกเลี่ยง static params ทั้งหมด (แนะนำถ้า setup ทำยากเกินไป)

## 7.11 Harvest Animation Flow

เมื่อ `water()` คืน `harvested != undefined`:
1. Trigger full-screen overlay: warm radial glow (สีตาม rarity)
2. ต้นไม้โผล่เต็มขนาด + confetti/leaves particles (ปิดเมื่อ reducedMotion)
3. แสดง species name + rarity
4. ปุ่ม "เก็บเข้า Gallery" → dismiss overlay
5. Scene กลับมาเป็น empty pot

## ✅ Definition of Done
- [ ] Home screen minimal layout: Gallery (TL) + Florist Card & Login (TR stack) + bottom button เท่านั้น
- [ ] Tree 3D เต็มจอ, orbit + pinch-zoom ได้ตลอด
- [ ] ปุ่มกลางเปลี่ยนตาม state (เริ่มปลูก → รดน้ำ → รดน้ำ disabled+countdown)
- [ ] Progress `%` text เหนือปุ่ม (เฉพาะเมื่อมี activeTree)
- [ ] Florist Card sheet: rank, stats 3 ช่อง, rarity bars, link → Gallery
- [ ] Login button แสดง "Coming Soon" dot + toast เมื่อแตะ
- [ ] Gallery grid โหลด thumbnails, filter by rarity
- [ ] Detail view 3D interactive + metadata
- [ ] Routing ระหว่าง screens ทำงาน
- [ ] Harvest animation แสดงตอน harvest

ถัดไป → [`08-mobile.md`](./08-mobile.md)
