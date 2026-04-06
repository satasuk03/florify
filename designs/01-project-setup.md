# Step 01 — Project Setup & Scaffolding (Next.js 16 · pnpm monorepo)

**Goal:** ได้ Next.js 16 App Router project ที่รันได้บน localhost, ติดตั้ง dependencies ครบ, config static export สำหรับ Cloudflare Pages, folder structure พร้อมรับ step ถัดไป — โดยอยู่ใน **pnpm monorepo** ที่พร้อมรับ `apps/api` (Cloudflare Workers) ในอนาคต

**Estimated time:** 1–2 ชม.

---

## 1.1 Initialize Monorepo + Project

ที่ root ของ repo (`florify/`) สร้าง workspace:

```bash
# root
pnpm init
# แก้ package.json → "name": "florify", "private": true
```

สร้าง `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Scaffold Next.js app ใต้ `apps/web`:

```bash
mkdir -p apps
pnpm create next-app@latest apps/web \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-pnpm --disable-git --yes
```

> ใน Next.js 16 scaffolder จะสร้าง Tailwind **v4** (ใช้ CSS `@theme` directive แทน `tailwind.config.ts`) — ดู step 02 สำหรับวิธีประกาศ design tokens

เพิ่ม `packages/shared` สำหรับ types/constants ที่ backend (step 10) จะ reuse:

```bash
mkdir -p packages/shared/src/{types,config}
# สร้าง packages/shared/package.json ด้วย name "@florify/shared", main "./src/index.ts"
```

## 1.2 Install Dependencies

```bash
# ที่ root — ติดตั้ง deps ของ apps/web ผ่าน filter
pnpm --filter @florify/web add three @react-three/fiber @react-three/drei zustand nanoid clsx
pnpm --filter @florify/web add @florify/shared --workspace

# Types
pnpm --filter @florify/web add -D @types/three

# Testing
pnpm --filter @florify/web add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
pnpm --filter @florify/web add -D @playwright/test
```

> **หมายเหตุ Next.js 16:** React 19 เป็น peer dependency แล้ว. `@react-three/fiber` v9 รองรับ React 19; `@react-three/drei` v10 รองรับเช่นกัน (drei v9 จะ warn peer deps แต่ยังใช้งานได้)

## 1.3 Folder Structure

```
florify/                          # monorepo root
├── pnpm-workspace.yaml
├── package.json                  # root — dev/build/typecheck/test scripts
├── tsconfig.base.json            # shared strict TS config
├── designs/
│
├── packages/
│   └── shared/                   # @florify/shared — pure TS, no React
│       ├── package.json
│       └── src/
│           ├── index.ts          # barrel
│           ├── types/game.ts     # TreeInstance, PlayerState, Rarity, ...
│           └── config/constants.ts  # SCHEMA_VERSION, COOLDOWN_MS, ...
│
└── apps/
    └── web/                              # @florify/web — Next.js 16 game
        ├── public/
        │   └── icons/                    # favicon + og image (no PWA icons)
        ├── src/
        │   ├── app/                      # Next.js App Router
        │   │   ├── layout.tsx            # Root layout (server component — viewport export)
        │   │   ├── page.tsx              # / → PlotView (home)
        │   │   ├── globals.css           # Tailwind v4 @theme tokens + mobile fixes
        │   │   ├── gallery/
        │   │   │   ├── page.tsx          # /gallery
        │   │   │   └── [id]/
        │   │   │       └── page.tsx      # /gallery/[treeId]
        │   │   └── settings/
        │   │       └── page.tsx          # /settings
        │   │
        │   ├── data/                     # Step 04
        │   │   └── species.ts            # 300 species table
        │   │
        │   ├── store/                    # Step 03 / 05
        │   │   ├── saveStore.ts          # localStorage adapter
        │   │   ├── debouncedSave.ts
        │   │   ├── initialState.ts
        │   │   ├── settingsStore.ts
        │   │   ├── migrations.ts
        │   │   └── gameStore.ts          # Zustand (Step 05)
        │   │
        │   ├── engine/                   # Step 04 — rng, lsystem, turtle, treeBuilder, treeCache
        │   ├── three/                    # Step 06 (all "use client")
        │   ├── screens/                  # Step 07 (all "use client")
        │   ├── components/               # Step 02 / 07 — Button, Card, RarityBadge, ...
        │   └── lib/                      # time, format, toast, haptics, notifications
        │
        ├── tests/
        │   ├── unit/                     # Step 09 — vitest
        │   └── e2e/                      # Step 09 — playwright
        │
        ├── next.config.ts
        ├── postcss.config.mjs
        ├── tsconfig.json                 # extends ../../tsconfig.base.json
        ├── vitest.config.ts
        └── package.json
```

> **Tailwind v4 note:** Next 16 scaffolds Tailwind v4, which uses **CSS-based config** (`@theme { ... }` inside `globals.css`) instead of `tailwind.config.ts`. Colors like `bg-cream-50` are generated from `--color-cream-50` CSS custom properties — see step 02.

### เกี่ยวกับ App Router pattern
- ทุก page ที่ใช้ Three.js / localStorage / Zustand ต้องเริ่มด้วย `'use client'`
- Page component ใน `app/` จะเป็น thin wrapper ที่ import screen จาก `src/screens/`:
  ```tsx
  // src/app/page.tsx
  'use client';
  import { PlotView } from '@/screens/PlotView';
  export default function Home() {
    return <PlotView />;
  }
  ```
- แยก page/screen เพื่อให้ test ง่าย และ refactor route ได้โดยไม่แตะ logic

## 1.4 Config Files

### `next.config.ts` (static export)

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export → Cloudflare Pages friendly
  output: 'export',

  // เพราะ static export ไม่มี image optimizer ฝั่ง server
  images: { unoptimized: true },

  // Strict mode
  reactStrictMode: true,

  // Trailing slash ช่วย routing บน Cloudflare Pages
  trailingSlash: true,

  // Transpile three (examples/jsm imports) + our workspace package
  transpilePackages: ['three', '@florify/shared'],
};

export default nextConfig;
```

> `output: 'export'` จะ build ออกเป็น `out/` directory เป็น static HTML/JS/CSS ล้วน ไม่มี Node.js runtime requirement → deploy ที่ Cloudflare Pages ได้เลย

### `tsconfig.json` (strict additions)

`apps/web/tsconfig.json` extends the root `tsconfig.base.json` which owns the strict settings:

```json
// apps/web/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "allowJs": true,
    "noEmit": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

```json
// tsconfig.base.json (root)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true
  }
}
```

### Tailwind (v4, CSS-based config)

Next.js 16 ships Tailwind v4 — there is **no** `tailwind.config.ts`. Tokens live in `src/app/globals.css` via the `@theme` directive. See step 02 for the full token set.

### `src/app/layout.tsx`

```tsx
import type { Metadata, Viewport } from 'next';
import { Sarabun } from 'next/font/google';
import './globals.css';

const sarabun = Sarabun({
  subsets: ['latin', 'thai'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sarabun',
});

export const metadata: Metadata = {
  title: 'Florify',
  description: 'Plant, water, and collect procedurally-generated trees',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FBF8F3',     // cream-50 from theme
  viewportFit: 'cover',      // สำหรับ safe-area
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${sarabun.variable} h-full antialiased`}>
      <body className="min-h-full bg-cream-50 text-ink-900">{children}</body>
    </html>
  );
}
```

> `viewport` / `metadata` exports are **only supported in Server Components**, so the root layout must NOT have `'use client'`. Screens that need client-side state/hooks live under `src/screens/` and are imported by thin `'use client'` page wrappers.

### `src/app/globals.css` (Tailwind v4 tokens — see step 02 for full version)

```css
@import "tailwindcss";

@theme {
  --color-cream-50: #FBF8F3;
  --color-ink-900: #2B241B;
  /* ...full token set in step 02 */
}

@layer base {
  html, body { height: 100%; background-color: var(--color-cream-50); color: var(--color-ink-900); }
  body {
    overscroll-behavior: none;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
}
```

### `src/app/page.tsx`

```tsx
'use client';
import { PlotView } from '@/screens/PlotView';

export default function Home() {
  return <PlotView />;
}
```

### `packages/shared/src/config/constants.ts`

Constants live in `@florify/shared` so a future `apps/api` Cloudflare Worker can validate payloads using the same SCHEMA_VERSION and storage keys.

```ts
export const SCHEMA_VERSION = 1 as const;
export const COOLDOWN_MS = 30 * 60 * 1000;      // 30 minutes
export const MIN_WATERINGS = 1;
export const MAX_WATERINGS = 10;
export const TOTAL_SPECIES = 300;
export const STORAGE_KEY = 'florify:v1:player';
export const SETTINGS_KEY = 'florify:v1:settings';
```

## 1.5 Smoke Check

จากที่ root ของ monorepo:

```bash
pnpm install
pnpm --filter @florify/web dev
```

เปิด `http://localhost:3000` → ต้องเห็นหน้าแรก (placeholder ก่อน จนกว่าจะถึง step 07)

```bash
pnpm --filter @florify/web build
```

→ ต้อง generate `apps/web/out/` สำเร็จ ไม่มี error

## 1.6 Cloudflare Pages Deploy

แอพ deploy ขึ้น **Cloudflare Pages** (free tier)

### Connect repo ครั้งเดียว
1. Push repo ขึ้น GitHub / GitLab
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Build settings:
   - **Framework preset**: `Next.js (Static HTML Export)`
   - **Build command**: `pnpm --filter @florify/web build`
   - **Build output directory**: `apps/web/out`
   - **Root directory**: (leave blank — build from repo root so pnpm workspace resolves)
   - **Environment variables**: `NODE_VERSION=20`, `PNPM_VERSION=9`
4. Deploy → ได้ `florify.zeze.app` + preview ทุก branch/PR

> **ทำไมไม่ใช้ `@cloudflare/next-on-pages`:** แอพนี้เป็น client-only 3D game ไม่มี SSR/Route Handlers ให้ deploy → static export เพียงพอและง่ายกว่า. ถ้าภายหลังเริ่มใช้ Route Handlers เป็น API แทน Workers ค่อยย้ายไป adapter

### Local preview

```bash
pnpm --filter @florify/web build
pnpm dlx serve apps/web/out
# หรือ pnpm dlx wrangler pages dev apps/web/out (เพื่อ test Cloudflare headers)
```

### `public/_redirects` (SPA fallback สำหรับ dynamic routes)

```
/gallery/*  /gallery/[id].html  200
```

Next.js static export จะ generate `.html` ต่อ route อยู่แล้ว ถ้าใช้ `trailingSlash: true` + dynamic routes จะทำงานบน Cloudflare Pages ได้โดยไม่ต้อง redirect rules (Pages จะ resolve `/gallery/abc/` → `/gallery/abc/index.html` ให้อัตโนมัติ)

## ✅ Definition of Done

- [ ] `pnpm install` ที่ root รันได้สำเร็จ, resolve ทั้ง `@florify/web` และ `@florify/shared`
- [ ] `pnpm --filter @florify/web dev` ทำงานที่ `localhost:3000` ไม่มี error
- [ ] `pnpm --filter @florify/web build` สร้าง `apps/web/out/` สำเร็จ
- [ ] `pnpm --filter @florify/web typecheck` clean (strict + noUncheckedIndexedAccess)
- [ ] Folder structure ตามด้านบน
- [ ] Path alias `@/*` ใช้ได้ + workspace import `@florify/shared` resolve ได้
- [ ] Tailwind v4 @theme tokens ทำงาน (ลองใส่ `bg-cream-50` ใน `page.tsx`)
- [ ] `'use client'` pattern ทำงานกับ screen component (root layout ยังเป็น server component)
- [ ] Cloudflare Pages connected + first deploy สำเร็จ, เปิด `*.pages.dev` ได้
- [ ] Refresh ที่ `/gallery/` → ไม่ 404

ถัดไป → [`02-design-system.md`](./02-design-system.md)
