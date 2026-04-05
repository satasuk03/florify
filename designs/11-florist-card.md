# Step 11 — Florist Card (Shareable Botanical Passport)

**Goal:** Tapping the Florist Card button on PlotView opens a passport-style modal that summarises the player's collection progress. A **Share** action generates a 1080×1920 PNG sized for Instagram / Facebook / TikTok stories and hands it to the OS share sheet so the player can post directly.

**Estimated time:** 1.5–2 days
**Supersedes:** `07-screens.md` §7.5 (keeps the modal concept, replaces the visual spec + adds sharing)

---

## 11.1 Vision

The card is the player's **trophy object** — the reason they come back. Gallery lists every tree, but the Florist Card is the one image they're proud to screenshot and send to a friend. It should read as a physical document: warm paper, serif wordmark, a serial number, an issuance date. Not a dashboard.

Three hard rules:

1. **The number that matters is "X / 300 species unlocked"** — that's the chase mechanic. Everything else is secondary.
2. **The shared image must stand on its own** — someone who has never played Florify should understand what it is.
3. **No PII on the card.** Display name is "Guest" until cloud login lands, and the card's serial is derived from `userId` (a local nanoid), not email.

## 11.2 User flow

```
PlotView
   │
   │  tap Florist Card corner button (top-right)
   ▼
FloristCardSheet (modal)
   │   ┌─ read-only passport view ─┐
   │   │  stats, rarity bars       │
   │   └───────────────────────────┘
   │
   │  tap [ Share ]
   ▼
ShareSheet (same modal, state transition)
   │  status: generating image…
   │    ↓
   │  status: ready → preview thumbnail
   │
   ├──► navigator.canShare({ files }) === true
   │        → navigator.share({ files, title, text })
   │          • iOS Safari 16.4+, Android Chrome, Edge mobile
   │          • OS sheet includes IG Stories, FB Stories, Line, Messages
   │
   └──► else
            → [ Save image ] button triggers download
              + toast: "บันทึกแล้ว เปิด Instagram แล้วเลือกรูปจากคลังได้เลย"
              + [ Copy link ] for florify.app
```

Dismissing the modal drops the generated blob immediately — we don't keep the PNG around between opens. Re-opening regenerates (fast; the underlying geometry is cached).

## 11.3 Data contract

`selectFloristCard()` already exists on the game store (`apps/web/src/store/gameStore.ts`) and returns `FloristCardData`. This step **extends** it with two derived fields — a stable card serial and an ISO issue date — so they're computed once and reused by both the modal and the share image.

```ts
// src/store/gameStore.ts — additions
export interface FloristCardData {
  // … existing fields (rank, speciesUnlocked, totalHarvested, currentStreak,
  //   longestStreak, rarityProgress, startedAt)

  /** Passport serial derived from userId, e.g. "FL-3K2P-9XQ4". Stable across sessions. */
  serial: string;

  /** Display name — "Guest" until cloud auth lands. Shown on the card. */
  displayName: string;
}
```

**Serial derivation** — first 8 alphanumeric chars of `userId` (nanoid, URL-safe) uppercased and dashed:

```ts
function deriveSerial(userId: string): string {
  const cleaned = userId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const chunk = (cleaned + 'XXXXXXXX').slice(0, 8);
  return `FL-${chunk.slice(0, 4)}-${chunk.slice(4, 8)}`;
}
```

This is reversible enough to be useful for support (players can read it off their card) but not enough to identify them. It is **not** secret — treat it like a BGG username.

**Display name sourcing** (forward-looking):

| When | Source |
|---|---|
| MVP (no auth) | Hardcoded `'Guest'`. The field exists so the Phase 7 cloud-sync step can wire it without refactoring. |
| Phase 7 (cloud) | `players.display_name` column; default to a random "Gardener #NNNN" on signup. |

## 11.4 Modal — in-app passport view

Visual layout (mobile, portrait — the card itself has a 9:16 aspect):

```
┌─────────────────────────────────────┐ ← bottom sheet on mobile
│  ✕                              ⤴  │    center modal on desktop
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ FLORIFY                       │  │ ← passport card body
│  │ BOTANICAL PASSPORT            │  │    (aspect-ratio 9/16, max-h 70vh)
│  │ ─────────────────────────────  │  │    mirrors the share image so
│  │                               │  │    players see the same thing
│  │            🌳                 │  │    they're about to share
│  │                               │  │
│  │         47 / 300              │  │
│  │       SPECIES UNLOCKED        │  │
│  │                               │  │
│  │         ◆ APPRENTICE ◆        │  │
│  │                               │  │
│  │  Common      ████████░░  38   │  │
│  │  Rare        ███░░░░░░░   8   │  │
│  │  Legendary   █░░░░░░░░░   1   │  │
│  │                               │  │
│  │  124 harvested · 🔥 12 day    │  │
│  │  Longest streak: 23           │  │
│  │                               │  │
│  │  Guest                        │  │
│  │  FL-3K2P-9XQ4                 │  │
│  │  Issued 05 Apr 2026           │  │
│  │                               │  │
│  │             florify.app       │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌──────────┐     ┌──────────────┐  │
│  │ ← ดู     │     │   แชร์       │  │ ← two-button row
│  │  Gallery │     │   🌼         │  │
│  └──────────┘     └──────────────┘  │
└─────────────────────────────────────┘
```

Background is `cream-50`; the card sits on `cream-100` with a 1px `cream-300` border and `shadow-soft-lg`. Taps outside the card dismiss the modal. The two action buttons are pinned below the card — the Share button is the primary (clay-500) and the Gallery link is secondary (ghost).

**Single component, two modes** — the in-app card and the share image render from the same logical definition so they can never drift. See §11.6.

## 11.5 Share image — dimensions and composition

| Parameter | Value | Notes |
|---|---|---|
| Output size | **1080 × 1920** | IG / FB / TikTok story canonical |
| Aspect ratio | 9:16 | Same story slot across platforms |
| DPR strategy | Draw at 1080×1920 directly | Not at logical size — avoid downscale blur |
| Format | `image/png` | PNG not JPEG; crisp text matters more than file size |
| Target file size | 200–400 KB | PNG with bitmap art, text-forward, no photography |
| Filename | `florify-passport-FL-3K2P-9XQ4.png` | Includes serial so repeated shares don't overwrite |

**Safe area.** Instagram/Facebook overlay attribution + reactions at the top ~220px and bottom ~250px. All critical content (card body, numbers, rank) must sit between `y ∈ [240, 1680]`.

**Composition (top to bottom, in pixels):**

```
y=0    ─┬── 1080×1920 canvas, background: linear-gradient(#FBF8F3 → #F3E9D6)
        │   decorative corner frames in cream-300 (4 × L-shaped strokes, 60px long)
y=240  ─┼── FLORIFY wordmark, 84px Fraunces 700, ink-900, centered
y=330  ─┤   BOTANICAL PASSPORT eyebrow, 32px Sarabun 500, ink-500, letter-spacing 0.3em
y=390  ─┼── divider line, 2px, cream-300, 720px wide, centered
y=480  ─┤
        │   hero number block
y=520  ─┼── "47 / 300", 180px Fraunces 700, ink-900, centered, tabular-nums
y=720  ─┤   "SPECIES UNLOCKED", 36px Sarabun 600, ink-500, letter-spacing 0.25em
y=820  ─┤
        │   rank pill
y=860  ─┼── ◆ APPRENTICE ◆, 48px Fraunces 600, clay-600, centered
y=960  ─┤
        │   rarity rows (3 × 120px blocks, 720px wide, center-aligned column)
y=1000 ─┼── Common      [████████░░] 38 / 200
y=1120 ─┤   Rare        [███░░░░░░░]  8 /  80
y=1240 ─┤   Legendary   [█░░░░░░░░░]  1 /  20
y=1360 ─┤   (bar: 420px wide, 18px tall, cream-200 bg, clay-500/leaf-500/legendary gold fill)
        │
y=1440 ─┤   "124 harvested · 🔥 12 day streak", 32px Sarabun 500, ink-700, centered
y=1500 ─┤   "Longest streak: 23 days", 26px Sarabun 400, ink-500, centered
        │
y=1600 ─┤   serial block, left-aligned within 720px column
y=1620 ─┤   "Guest", 32px Sarabun 600, ink-900
y=1665 ─┤   "FL-3K2P-9XQ4", 28px monospace, ink-500
y=1710 ─┤   "Issued 05 Apr 2026", 24px Sarabun 400, ink-500
        │
y=1800 ─┴── "florify.app", 28px Sarabun 500, clay-500, right-aligned
```

**Optional hero mark** — a single rendered leaf silhouette positioned behind the hero number at ~25% opacity. Use the shape from one species the player has already unlocked (pick deterministically by hashing `userId % collection.length`). Skip this in v1 if it complicates rendering — text-forward is fine to start.

**Rarity bar colors:**

| Tier | Bar fill | Bar bg |
|---|---|---|
| Common | `#B8A888` (taupe) | `#EEE6D6` |
| Rare | `#7A9CB8` (dusty blue) | `#EEE6D6` |
| Legendary | `#D4A24C` (warm gold) | `#EEE6D6` |

## 11.6 Implementation — one definition, two renderers

The in-app card and the share image must never diverge. To enforce that, we write the layout **once** as a pure data structure and provide two renderers:

```
src/components/florist-card/
├── FloristCardSheet.tsx       # Modal wrapper — opens/closes, holds share UI state
├── PassportCard.tsx           # In-app React/DOM renderer (reads FloristCardData)
├── passportLayout.ts          # Pure layout spec — positions, sizes, colors
├── renderPassportImage.ts     # Canvas 2D renderer → Blob (reads the same spec)
└── sharePassport.ts           # Web Share API wrapper + download fallback
```

**`passportLayout.ts`** exports a function that takes `FloristCardData` and returns a list of draw instructions (text runs, rectangles, gradients). Both renderers walk the same list. The DOM renderer translates draw instructions into absolute-positioned `<div>` / `<span>` / `<svg>`, while the canvas renderer translates them into `fillText` / `fillRect` / `createLinearGradient` calls.

This sounds over-engineered for a single screen, but it's the only way to keep the preview modal and the shared file pixel-identical. Without it, every tweak to the card would need to be applied twice.

> **Alternative we're not taking:** `html2canvas` / `dom-to-image`. Both are heavy (40–60KB gzipped), have well-known issues with custom fonts under `next/font`, and produce blurry output on DPR mismatch. Canvas 2D is ~200 lines of code and gives us pixel control.

### `renderPassportImage.ts` sketch

```ts
import type { FloristCardData } from '@/store/gameStore';
import { buildLayout } from './passportLayout';

export async function renderPassportImage(
  data: FloristCardData,
): Promise<Blob> {
  // Fonts must be loaded before draw, else canvas falls back to serif sans
  await document.fonts.ready;

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, '#FBF8F3');
  bg.addColorStop(1, '#F3E9D6');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1920);

  // Walk layout instructions
  const layout = buildLayout(data);
  for (const op of layout) {
    switch (op.type) {
      case 'text':
        ctx.font = `${op.weight} ${op.size}px ${op.family}`;
        ctx.fillStyle = op.color;
        ctx.textAlign = op.align;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(op.text, op.x, op.y);
        break;
      case 'rect':
        ctx.fillStyle = op.color;
        ctx.fillRect(op.x, op.y, op.w, op.h);
        break;
      case 'stroke':
        ctx.strokeStyle = op.color;
        ctx.lineWidth = op.width;
        ctx.beginPath();
        ctx.moveTo(op.x1, op.y1);
        ctx.lineTo(op.x2, op.y2);
        ctx.stroke();
        break;
      // ... gradient, image
    }
  }

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/png',
    ),
  );
}
```

### `sharePassport.ts`

```ts
import type { FloristCardData } from '@/store/gameStore';
import { renderPassportImage } from './renderPassportImage';

export type ShareResult =
  | { kind: 'shared' }
  | { kind: 'downloaded'; url: string }
  | { kind: 'cancelled' }
  | { kind: 'error'; message: string };

export async function sharePassport(data: FloristCardData): Promise<ShareResult> {
  try {
    const blob = await renderPassportImage(data);
    const file = new File([blob], `florify-passport-${data.serial}.png`, {
      type: 'image/png',
    });

    // Native share sheet path — iOS Safari 16.4+, Android Chrome, Edge mobile
    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: 'My Florify Passport',
          text: `${data.speciesUnlocked}/300 species unlocked 🌳 florify.app`,
        });
        return { kind: 'shared' };
      } catch (err) {
        // User cancelled the share sheet — not an error
        if ((err as DOMException).name === 'AbortError') return { kind: 'cancelled' };
        throw err;
      }
    }

    // Fallback: download the image so the user can post from their camera roll
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Revoke later so the anchor click completes first
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    return { kind: 'downloaded', url };
  } catch (err) {
    return { kind: 'error', message: err instanceof Error ? err.message : String(err) };
  }
}
```

### `FloristCardSheet.tsx` states

```ts
type SheetState =
  | { phase: 'viewing' }
  | { phase: 'generating' }
  | { phase: 'shared' }
  | { phase: 'downloaded'; url: string }
  | { phase: 'error'; message: string };
```

UI transitions:

| Phase | Button label | Under-button hint |
|---|---|---|
| `viewing` | **แชร์** 🌼 | — |
| `generating` | **กำลังสร้างรูป…** (disabled) | Spinner |
| `shared` | **แชร์อีกครั้ง** | ✅ แชร์แล้ว (auto-clears after 3s) |
| `downloaded` | **แชร์อีกครั้ง** | 💾 บันทึกรูปแล้ว — เปิด Instagram → Stories → เลือกจากคลัง |
| `error` | **ลองอีกครั้ง** | ⚠️ ไม่สามารถสร้างรูปได้ ({message}) |

## 11.7 Accessibility + reduced motion

- Modal traps focus inside the card body while open; `Esc` dismisses. Use an existing headless dialog pattern (we already have a simple backdrop click-to-close in the placeholder).
- Share button exposes `aria-label="Share Florist Card to Instagram or Facebook story"` so screen readers announce intent, not just the icon.
- When `prefers-reduced-motion` is set, skip the modal's slide-up transition — render directly in place.
- The share image itself needs no motion considerations (it's a still), but ensure text passes WCAG AA contrast on the cream background: ink-900 on cream-50 is 12.4:1, ink-500 on cream-50 is 4.7:1. Both pass.

## 11.8 Performance budget

| Stage | Target | Notes |
|---|---|---|
| First modal open | < 150 ms | DOM-only, no canvas draw yet |
| Share button tap → native sheet | < 800 ms | Dominated by canvas draw + `toBlob` on mobile |
| Image size | 200–400 KB | Enforced by composition (flat colors, no photos) |
| Memory | Single canvas held for the duration of one share | Released on modal close |

On low-end Android the full pipeline is roughly: `document.fonts.ready` (50–200 ms first time, 0 ms cached) + draw 1080×1920 (50–150 ms) + `toBlob` (100–300 ms). Well under the 800 ms target, and the user sees a spinner during.

## 11.9 Browser support matrix

| Platform | Native share sheet | Download fallback |
|---|---|---|
| iOS Safari 16.4+ | ✅ `navigator.share({ files })` | n/a |
| iOS Safari <16.4 | ❌ (no canShare files) | ✅ Downloads to Files → open from IG |
| Android Chrome 96+ | ✅ | n/a |
| Android Firefox | ⚠️ Partial (text only, not files in some versions) | ✅ Download fallback triggers |
| Desktop Chrome / Safari / Firefox | ❌ (no files support) | ✅ Downloads PNG, toast shows link |
| In-app webviews (IG, Line, FB) | ❌ (blocks share API) | ✅ Downloads; user shares externally |

The fallback path is the backbone — **every browser must at worst be able to save the PNG**. The Web Share API is a UX upgrade, not a requirement.

## 11.10 Analytics events (future, Phase 7)

Don't wire these yet, but leave the hook points named so they're easy to add later:

- `florist_card_opened` — modal shown
- `florist_card_share_started` — user tapped Share
- `florist_card_share_result` — with `kind`: `shared` / `downloaded` / `cancelled` / `error`
- `florist_card_share_platform` — unreliable (OS share sheet doesn't report target), but if we ever add explicit platform buttons (IG / FB / Line) they'd emit this.

## 11.11 Test plan

### Unit (Vitest)

- `deriveSerial` — empty, short, long, non-alphanumeric userIds all produce a valid `FL-XXXX-XXXX` shape
- `buildLayout` — snapshot the draw instruction list for a known `FloristCardData` so visual regressions are caught in text form
- `sharePassport` — mock `navigator.canShare` and `renderPassportImage` to cover all five `ShareResult` branches without touching real canvas

### Integration (Playwright, Phase 6)

- Open modal → assert the hero number matches `selectFloristCard().speciesUnlocked`
- Tap Share on a desktop (no `canShare`) → asserts a `.png` download is triggered and filename contains the serial
- Tap Share on a mobile emulation → mock `navigator.share` to a resolved promise, assert UI transitions to `shared` phase

### Manual

- Take a screenshot on iPhone 12 (iOS 17) + Pixel 6 + desktop Chrome; paste next to each other and eyeball that the in-app card and the downloaded PNG are pixel-identical. This is the single most important check because the shared-spec approach depends on it.
- Post to real IG Stories and confirm no critical content is covered by the header/footer overlays.

## 11.12 File checklist

- [ ] `src/components/florist-card/passportLayout.ts` — pure layout spec
- [ ] `src/components/florist-card/PassportCard.tsx` — DOM renderer
- [ ] `src/components/florist-card/renderPassportImage.ts` — Canvas 2D renderer → Blob
- [ ] `src/components/florist-card/sharePassport.ts` — Web Share + download fallback
- [ ] `src/components/florist-card/FloristCardSheet.tsx` — modal wrapper
- [ ] `src/store/gameStore.ts` — add `serial` + `displayName` to `FloristCardData`, implement `deriveSerial`
- [ ] `tests/unit/sharePassport.test.ts` — all four `ShareResult` branches
- [ ] `tests/unit/passportLayout.test.ts` — layout snapshot

## ✅ Definition of Done

- [ ] Tapping the Florist Card corner button on PlotView opens the passport modal with the same stats as `selectFloristCard()`
- [ ] The in-app card and the generated PNG are pixel-identical (eyeball + snapshot test)
- [ ] Native share sheet opens on iOS Safari 16.4+ and Android Chrome with the PNG attached
- [ ] Desktop + old iOS + webviews fall back to a download with the correct filename
- [ ] No PII on the card; serial is derived from `userId` only
- [ ] `prefers-reduced-motion` disables the modal entrance transition
- [ ] Share image ≤ 400 KB on typical collections
- [ ] Rendering is < 800 ms on mid-range mobile

---

Cross-refs:
- Modal-and-stats sketch in `07-screens.md` §7.5 is superseded by this doc
- `FloristCardData` + `selectFloristCard()` live in `apps/web/src/store/gameStore.ts` (implemented in Phase 3)
- `displayName` will wire to cloud auth in `10-cloud-sync.md` Phase 7
