# Step 08 — Mobile Polish & Notifications

**Goal:** เว็บธรรมดา (ไม่ใช่ PWA) ที่เล่นบน mobile browser ได้ลื่น, รองรับ haptics, safe-area, และมี in-tab notification เตือน cooldown หมด

**Estimated time:** 0.5–1 วัน

> **หมายเหตุ:** step นี้ **ไม่มี PWA / service worker** — แอพเป็นเว็บปกติ deploy เป็น static บน Cloudflare Pages ผลกระทบ:
> - ❌ ไม่มี add-to-home-screen แบบ standalone (iOS ยังทำได้แบบ Safari bookmark แต่ไม่มี manifest)
> - ❌ ไม่มี Web Push (ต้องใช้ SW) → ทำได้แค่ Notification API ขณะ tab เปิด
> - ❌ ไม่มี offline mode
> - ✅ Bundle เล็ก, setup ง่าย, ไม่ต้องจัดการ cache versioning

---

## 8.1 Viewport & Mobile Meta

ตั้งแล้วใน `src/app/layout.tsx` (step 01):

```tsx
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FBF8F3',
  viewportFit: 'cover',
};
```

เพิ่ม Apple-specific meta ใน `layout.tsx` ถ้าต้องการ status bar สีเข้ากัน (ไม่จำเป็น):

```tsx
export const metadata: Metadata = {
  title: 'Tree Game',
  description: 'Plant, water, and collect procedurally-generated trees',
  appleWebApp: {
    capable: false,       // ไม่เป็น PWA
    statusBarStyle: 'default',
  },
};
```

## 8.2 Global CSS Mobile Fixes

อยู่ใน `src/app/globals.css`:

```css
html, body { height: 100%; }

body {
  overscroll-behavior: none;          /* กัน pull-to-refresh */
  touch-action: manipulation;          /* ลด 300ms tap delay */
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
}

/* Safe area for notch / home indicator */
.safe-top    { padding-top: env(safe-area-inset-top); }
.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
.safe-x      { padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right); }

/* Prevent iOS zoom on input focus */
input, textarea, select { font-size: 16px; }
```

**ใช้ `100dvh` ไม่ใช่ `100vh`** ทุกที่ที่เต็มจอ — เพราะ `100vh` บน mobile จะนับ URL bar ด้วย ทำให้เผื่อพื้นที่เกิน:

```tsx
<main className="h-[100dvh] w-full safe-x">...</main>
```

## 8.3 Haptics

```ts
// src/lib/haptics.ts
import { loadSettings } from '@/store/settingsStore';

export function haptic(pattern: number | number[] = 10) {
  if (typeof navigator === 'undefined') return;
  if (!loadSettings().haptics) return;
  if ('vibrate' in navigator) navigator.vibrate(pattern);
}

// Usage
haptic(12);                    // tap
haptic([20, 40, 20]);          // water success
haptic([30, 50, 30, 50, 80]);  // harvest!
```

> **รองรับ:** Android Chrome/Firefox ได้ 100%, iOS Safari **ไม่รองรับ** `navigator.vibrate` (เป็นข้อจำกัดของ Apple ยังปิดไว้แม้ iOS 17)

## 8.4 In-Tab Notifications (แทน Web Push)

ไม่มี service worker → แจ้งเตือนได้เฉพาะเมื่อ **tab ยังเปิดอยู่** (อาจเป็น background tab ก็ได้) ใช้ `Notification` API + `setTimeout` ตรงๆ

### 8.4.1 Request permission

```ts
// src/lib/notifications.ts
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const p = await Notification.requestPermission();
  return p === 'granted';
}

export function canNotify(): boolean {
  return typeof window !== 'undefined'
    && 'Notification' in window
    && Notification.permission === 'granted';
}
```

### 8.4.2 Schedule cooldown reminder

```ts
let timerId: number | null = null;

export function scheduleCooldownNotification(whenMs: number) {
  if (typeof window === 'undefined') return;
  if (timerId != null) {
    clearTimeout(timerId);
    timerId = null;
  }
  const delta = whenMs - Date.now();
  if (delta <= 0) return;
  if (!canNotify()) return;

  timerId = window.setTimeout(() => {
    timerId = null;
    // เช็คอีกรอบเผื่อ tab ถูกหยุด timer
    if (!canNotify()) return;
    new Notification('ต้นไม้พร้อมรดน้ำแล้ว 💧', {
      body: 'แวะมารดน้ำเพื่อสะสม progress กันเถอะ',
      icon: '/icons/icon-192.png',
      tag: 'water-ready',       // dedupe
      silent: false,
    });
  }, delta);
}

export function cancelCooldownNotification() {
  if (timerId != null) {
    clearTimeout(timerId);
    timerId = null;
  }
}
```

### 8.4.3 Hook into game store

ใน `gameStore` action `waterTree`:

```ts
import { scheduleCooldownNotification } from '@/lib/notifications';

waterTree: () => {
  // ... existing logic
  if (!harvested && updated.activeTree) {
    const nextAt = updated.activeTree.lastWateredAt! + COOLDOWN_MS;
    scheduleCooldownNotification(nextAt);
  }
}
```

### 8.4.4 Re-arm on tab visible

เพราะ browsers บางตัวจะ throttle `setTimeout` ที่ยาวมากเมื่อ tab อยู่ background — พอ tab กลับมา foreground ให้ re-schedule ใหม่ด้วยเวลาที่เหลือจริง:

```tsx
// src/app/StoreHydrator.tsx (extend)
useEffect(() => {
  const onVisible = () => {
    if (document.visibilityState !== 'visible') return;
    const s = useGameStore.getState();
    s.checkinStreak();
    const tree = s.state.activeTree;
    if (tree?.lastWateredAt) {
      scheduleCooldownNotification(tree.lastWateredAt + COOLDOWN_MS);
    }
  };
  document.addEventListener('visibilitychange', onVisible);
  return () => document.removeEventListener('visibilitychange', onVisible);
}, []);
```

### 8.4.5 UI toggle ใน Settings

```tsx
// src/screens/SettingsView.tsx
async function onToggleNotifications() {
  const ok = await requestNotificationPermission();
  if (!ok) {
    toast('ไม่ได้รับอนุญาต — เปิดใน browser settings');
    return;
  }
  updateSettings({ notifications: true });
  toast('แจ้งเตือนเปิดแล้ว (เฉพาะตอน tab เปิดอยู่)');
}
```

แสดง **disclaimer** ใต้ toggle: *"แจ้งเตือนจะทำงานเฉพาะเมื่อเปิด tab นี้ค้างไว้ เพราะไม่ใช่ PWA"*

## 8.5 Visibility-based State Refresh

พอกลับมา foreground → re-check cooldown UI, streak:

```ts
useEffect(() => {
  const onVisible = () => {
    if (document.visibilityState === 'visible') {
      useGameStore.getState().checkinStreak();
      // Force re-render cooldown countdown
      useGameStore.setState({ state: { ...useGameStore.getState().state } });
    }
  };
  document.addEventListener('visibilitychange', onVisible);
  return () => document.removeEventListener('visibilitychange', onVisible);
}, []);
```

## 8.6 Font Strategy

ใช้ `next/font` เพื่อ self-host ลดการเรียก external request (เข้ากับ static export):

```tsx
// src/app/layout.tsx
import { Inter, Sarabun } from 'next/font/google';

const sarabun = Sarabun({
  subsets: ['latin', 'thai'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sarabun',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body className="bg-cream-50 text-ink-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
```

## 8.7 Mobile UX Checklist

| Item | Detail |
|---|---|
| Tap delay | `touch-action: manipulation` ใน body |
| Pull-to-refresh | `overscroll-behavior: none` |
| URL bar ขยับ | ใช้ `100dvh` |
| Notch safe area | `env(safe-area-inset-*)` utilities |
| Zoom on input | `font-size: 16px` + `maximumScale: 1` |
| Double-tap zoom | `touch-action: manipulation` |
| Scroll bounce ใน canvas | Canvas wrapper `touch-action: none` |
| Text selection | `user-select: none` บน UI chrome (ไม่ใช่บน input) |
| Horizontal scroll | ตรวจ `overflow-x: hidden` on body |

## 8.8 Cloudflare Pages — Headers & Cache

สร้าง `public/_headers`:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: interest-cohort=()

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/icons/*
  Cache-Control: public, max-age=31536000, immutable
```

Next.js static export วาง hashed assets ที่ `_next/static/*` → cache ยาวได้ปลอดภัย

> Deploy settings ตั้งแล้วใน step 01 (`01-project-setup.md`)

## ✅ Definition of Done

- [ ] เปิดบน mobile browser จริง (iOS Safari + Android Chrome) ไม่มี horizontal scroll
- [ ] Safe area ทำงานถูก (notch iPhone ไม่ทับ UI)
- [ ] ไม่ zoom เมื่อ double-tap / focus input
- [ ] ไม่มี pull-to-refresh ตอน drag canvas
- [ ] `100dvh` ใช้งานถูก — ไม่มี content หลุดใต้ URL bar
- [ ] Haptics ทำงานบน Android (iOS ไม่มีก็ OK)
- [ ] Notification toggle ใน Settings → ขอ permission + แสดง disclaimer
- [ ] รดน้ำ → schedule notification → tab ยังเปิด 30 นาที → เด้งจริง
- [ ] Re-arm notification เมื่อ tab กลับมา foreground
- [ ] `_headers` file อยู่ใน `public/` และ Cloudflare Pages apply ถูก

ถัดไป → [`09-testing.md`](./09-testing.md)
