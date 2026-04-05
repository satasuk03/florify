# Step 02 — Design System (Off-White Warm Theme)

**Goal:** มี design tokens, Tailwind preset, และ base components ที่ทุก screen จะใช้ร่วมกัน โทน **off-white + warm** ให้ความรู้สึกอบอุ่นเหมือนแสงเช้าในสวน

**Estimated time:** 3–4 ชม.

---

## 2.1 Visual Direction

แรงบันดาลใจ: morning light, cream paper, ดินเผา, linen, latte
- พื้นหลังไม่ใช่ `#ffffff` แต่เป็น off-white อมเหลือง/ส้มอ่อน
- ใช้ warm neutrals (beige, sand, clay) เป็น surface
- Accent เขียวใบไม้ + ดินเผาอุ่นๆ
- Text ไม่ใช่ดำจัด ใช้ warm brown-black
- Shadow นุ่ม ไม่คม — เหมือนแสงธรรมชาติ

## 2.2 Color Tokens

### Base palette (`src/theme/tokens.ts`)

```ts
export const colors = {
  // Surface — off-white warm scale
  cream: {
    50:  '#FBF8F3',   // lightest background — app bg
    100: '#F6F1E8',   // card surface
    200: '#EEE6D6',   // subtle divider, hover
    300: '#E3D7C0',   // border
    400: '#D1C0A0',   // muted
  },

  // Ink — warm dark text (ไม่ใช่ pure black)
  ink: {
    900: '#2B241B',   // primary text
    700: '#4A3F30',   // secondary text
    500: '#6B5E4B',   // tertiary / placeholder
    300: '#9C8F7B',   // disabled
  },

  // Accent — earthy clay / terracotta
  clay: {
    400: '#D89872',   // primary button hover
    500: '#C7825A',   // primary action
    600: '#A96842',   // pressed
  },

  // Leaf — nature green
  leaf: {
    300: '#A8C49A',
    500: '#6B8E4E',   // success, harvest
    700: '#4A6B35',
  },

  // Rarity tier colors
  rarity: {
    common:    '#B8A888',   // warm taupe
    rare:      '#7A9CB8',   // dusty blue (แต่ warm-tinted)
    legendary: '#D4A24C',   // warm gold
  },

  // Utility
  water:   '#8EB5C7',       // watering UI accent (muted blue)
  warning: '#C9925E',
  danger:  '#B5574A',
} as const;

export const radius = {
  sm: '0.375rem',
  md: '0.625rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px',
} as const;

export const shadow = {
  // Warm, soft shadows (ไม่ใช่ neutral gray)
  sm: '0 1px 2px rgba(75, 55, 30, 0.06)',
  md: '0 4px 12px rgba(75, 55, 30, 0.08)',
  lg: '0 12px 32px rgba(75, 55, 30, 0.12)',
  glow: {
    common:    '0 0 24px rgba(184, 168, 136, 0.4)',
    rare:      '0 0 32px rgba(122, 156, 184, 0.5)',
    legendary: '0 0 48px rgba(212, 162, 76, 0.6)',
  },
} as const;

export const spacing = {
  // Use Tailwind defaults (4px scale) + these semantic sizes
  tapTarget: '2.75rem',   // 44px — iOS touch target
  screenPad: '1rem',      // 16px — mobile screen padding
} as const;
```

### 2.3 Typography

ใช้ **Inter** สำหรับ UI + **Fraunces** (serif warm) สำหรับ headlines ให้ดูอบอุ่น
หรือถ้าอยาก loadless → ใช้ `ui-serif` + `ui-sans-serif`

```ts
// src/theme/tokens.ts (continue)
export const fonts = {
  sans: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  serif: "'Fraunces', ui-serif, Georgia, serif",
} as const;

export const fontSize = {
  xs:   ['0.75rem',  { lineHeight: '1rem' }],
  sm:   ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem',     { lineHeight: '1.5rem' }],
  lg:   ['1.125rem', { lineHeight: '1.75rem' }],
  xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
  '2xl':['1.5rem',   { lineHeight: '2rem' }],
  '3xl':['1.875rem', { lineHeight: '2.25rem' }],
  '4xl':['2.25rem',  { lineHeight: '2.5rem' }],
} as const;
```

เพิ่มใน `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

## 2.4 Tailwind Config (full)

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { colors, fonts, fontSize, shadow, radius } from './src/theme/tokens';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: { sans: fonts.sans, serif: fonts.serif },
      fontSize,
      borderRadius: radius,
      boxShadow: {
        'soft-sm': shadow.sm,
        'soft-md': shadow.md,
        'soft-lg': shadow.lg,
        'glow-common':    shadow.glow.common,
        'glow-rare':      shadow.glow.rare,
        'glow-legendary': shadow.glow.legendary,
      },
      backgroundImage: {
        // Subtle warm gradient for hero/backgrounds
        'warm-dawn': 'linear-gradient(180deg, #FBF8F3 0%, #F3E9D6 100%)',
        'warm-dusk': 'linear-gradient(180deg, #F6F1E8 0%, #E8D9BE 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

## 2.5 Global Styles (`src/index.css` additions)

```css
@layer base {
  html, body {
    background-color: theme('colors.cream.50');
    color: theme('colors.ink.900');
    font-family: theme('fontFamily.sans');
  }
  h1, h2, h3 { font-family: theme('fontFamily.serif'); font-weight: 600; }
  button { -webkit-tap-highlight-color: transparent; }
}

@layer components {
  .safe-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
  .safe-top    { padding-top: max(1rem, env(safe-area-inset-top)); }
}
```

## 2.6 Base Components

### `src/components/Button.tsx`
```tsx
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-clay-500 text-cream-50 hover:bg-clay-400 active:bg-clay-600 shadow-soft-md',
  secondary: 'bg-cream-100 text-ink-900 hover:bg-cream-200 border border-cream-300',
  ghost:     'bg-transparent text-ink-700 hover:bg-cream-100',
};
const sizeClasses: Record<Size, string> = {
  md: 'h-11 px-5 text-base rounded-lg',
  lg: 'h-14 px-8 text-lg rounded-xl min-w-[180px]',
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', className, ...rest }, ref) => (
    <button
      ref={ref}
      className={clsx(
        'font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    />
  ),
);
Button.displayName = 'Button';
```

### `src/components/Card.tsx`
```tsx
export function Card({ className = '', ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-cream-100 border border-cream-300 rounded-xl shadow-soft-sm ${className}`}
      {...rest}
    />
  );
}
```

### `src/components/RarityBadge.tsx`
```tsx
import type { Rarity } from '@/types/game';

const label: Record<Rarity, string> = {
  common: 'Common',
  rare: 'Rare',
  legendary: 'Legendary',
};
const cls: Record<Rarity, string> = {
  common:    'bg-cream-200 text-ink-700',
  rare:      'bg-[#E5EDF3] text-[#3E5A73]',
  legendary: 'bg-[#F7EBCF] text-[#8A5E1C]',
};

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls[rarity]}`}>
      {label[rarity]}
    </span>
  );
}
```

### `src/components/CountdownTimer.tsx`
```tsx
import { useEffect, useState } from 'react';

export function CountdownTimer({ until }: { until: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = Math.max(0, until - now);
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return (
    <span className="tabular-nums font-mono text-ink-700">
      {m}:{s.toString().padStart(2, '0')}
    </span>
  );
}
```

## 2.7 Three.js Color Pairing

Scene background ควรเข้ากับ UI theme:
```ts
// ใน step 06 เราจะใช้:
scene.background = new THREE.Color('#FBF8F3');   // cream.50
scene.fog = new THREE.Fog('#F3E9D6', 8, 24);     // warm dawn gradient haze
```
Lighting: directional light สีอุ่น `#FFE8C8` + ambient `#F0DFC4` จะทำให้ต้นไม้ดูเป็น morning scene

## ✅ Definition of Done
- [ ] `src/theme/tokens.ts` มีครบ colors, fonts, shadow, radius
- [ ] Tailwind config extend tokens และ build ผ่าน
- [ ] Fonts Inter + Fraunces โหลดใน `index.html`
- [ ] `Button`, `Card`, `RarityBadge`, `CountdownTimer` render ได้
- [ ] Storybook page / playground route แสดง component gallery (optional)
- [ ] Screen background เป็น cream-50, text เป็น ink-900 ไม่ใช่ pure black/white

ถัดไป → [`03-data-model.md`](./03-data-model.md)
