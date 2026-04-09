@AGENTS.md

# Water Drops System

Watering is resource-based, not cooldown-based. Players accumulate **water drops** over time and spend 1 drop per tap of the Water button.

- **Constants** (`packages/shared/src/config/constants.ts`):
  - `MAX_WATER_DROPS = 50` — pool cap
  - `DROP_REGEN_MS = 2 min` — 1 drop regenerates every 2 minutes
  - `MIN_WATER_COST = 12`, `MAX_WATER_COST = 25` — drops needed per flora (random)
  - `FIRST_FLORA_COST = 10` — first-ever flora costs less for onboarding
- **Debug override** (`src/lib/debug.ts`): `DROP_REGEN_MS` is shorter in debug mode. Always import from here, not from `@florify/shared`.
- **`computeDrops(state)`** (`src/store/gameStore.ts`): pure function that calculates current drops from `lastDropRegenAt` + elapsed time. Timestamp-based so it self-corrects after background tabs or sleep.
- **Selectors**: `canWater()` (drops >= 1 && tree exists), `waterDrops()` (computed count), `nextDropAt()` (epoch ms of next regen, null if full).
- **UI** (`src/components/DropsIndicator.tsx`): glassy pill showing `💧 N/50 · ⏳ M:SS`. Has pop animation on count change and bounce on the emoji.
- **No cooldown** between taps — user can rapid-fire water until drops run out.
- **Schema version 3** — migration from v2 in `src/store/migrations.ts` grants full drops and strips `lastWateredAt` from `TreeInstance`.

### Gotcha: forceTick interval vs SeedPacket

The 1-second `forceTick` interval (for drop regen display) must NOT run during `phase === "opening"`. It causes `onComplete` callback ref to change every tick, which resets SeedPacket's internal setTimeout and prevents the opening animation from ever completing. The interval is gated on `phase === "tree"`.

# i18n (TH / EN)

Bilingual support is **client-side only** — no library, no locale routes, no SSR boundary. This preserves `output: 'export'` in `next.config.ts`.

- **Dictionary:** `src/i18n/dict.ts` — flat dot-path keys (`plot.plant`, `settings.title`, …) for both `th` and `en`. Add new strings here, not hardcoded.
- **Hook:** `src/i18n/useT.ts` — `useT()` returns `t(key, vars?)`; `useLanguage()` returns the active code. Both subscribe via `useSyncExternalStore` so components re-render the instant the user toggles.
- **State:** language lives on `Settings.language` (`packages/shared/src/types/game.ts`) and persists through the existing `settingsStore` / localStorage (`florify:v1:settings`). Default is `'th'`.
- **Toggle UI:** `src/components/LanguageToggle.tsx` — round `CornerButton` showing the current code, click to cycle. Mounted under the Gallery button in `PlotView`.
- **Scope so far:** PlotView, GalleryView, and the Settings sheet (+ all 4 sections). Florist Card, Debug, and secondary dialogs are still Thai-only — migrate them incrementally by replacing literals with `t('…')` and adding keys to both `th` and `en` in `dict.ts`.
- **Variables:** use `{name}` placeholders in dict values and pass `t('key', { name: value })`.
- **Do NOT** introduce `next-intl`, `react-i18next`, or `[locale]` route segments — they break static export or add weight for zero benefit at 2 languages.

# Game State & Persistence

- **Store:** Zustand (`src/store/gameStore.ts`) — single source of truth for `PlayerState`.
- **Persistence:** browser localStorage only (`florify:v1:player`), debounced 500ms via `src/store/debouncedSave.ts`. No backend.
- **Schema migrations:** `src/store/migrations.ts` — chain of v1→v2→v3 functions. Bump `SCHEMA_VERSION` in shared constants when adding fields.
- **Hydration:** `src/store/StoreHydrator.tsx` — mounted once from layout, runs `hydrate()` on mount and re-checks streak + drop regen on `visibilitychange`.
- **Import/Export:** base64 save codes via `src/lib/saveTransfer.ts`, UI in Settings sheet.

# Flora & Species

- 305 species split across `src/data/species/series-{0,1,2,3}.ts`, re-exported from `src/data/species/index.ts`. Types live in `src/data/species/types.ts`. To add a new batch, create a new `series-N.ts` and import it in `index.ts`.
- Rarity weights: 82% common, 15% rare, 3% legendary (`src/data/rarityWeights.ts`).
- Images: `public/floras/{folder}/stage-{1,2,3}.webp` — 3 growth stages per species.
- Stage thresholds: < 1/3 progress → stage 1, < 2/3 → stage 2, >= 2/3 → stage 3.
- Adding a new flora: use the `/add-flora` skill.

# Notifications

- In-tab only (not PWA) — `src/lib/notifications.ts`.
- `scheduleDropsNotification` / `cancelDropsNotification` — fires when drops regenerate.
- Only works while tab is open. Re-armed on `visibilitychange`.

# PWA Cache & Service Worker

- **SW file:** `public/sw.js` — manually managed (no Workbox).
- **Cache names:** `florify-v{N}`, `florify-static-v{N}`, `florify-flora-v{N}` — bump N to force full cache refresh.
- **If PWA freezes after deploy:** bump all 3 cache version numbers in `sw.js`, commit & deploy. The activate handler deletes old caches automatically. localStorage (save data) is unaffected.
- **Why it happens:** iOS PWA (WKWebView) can be slow to update the SW, causing stale JS to be served from cache-first static assets.

# Testing

- Unit: `pnpm test` (vitest) — `tests/unit/gameStore.test.ts` covers plant, water, drops, regen, harvest, streak, migration.
- E2E: `pnpm test:e2e` (Playwright) — `tests/e2e/happy-path.spec.ts` uses `window.__gameStore` to force `requiredWaterings=1` for quick harvest.
