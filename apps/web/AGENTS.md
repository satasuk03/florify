<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# i18n (TH / EN)

Bilingual support is **client-side only** — no library, no locale routes, no SSR boundary. This preserves `output: 'export'` in `next.config.ts`.

- **Dictionary:** `src/i18n/dict.ts` — flat dot-path keys (`plot.plant`, `settings.title`, …) for both `th` and `en`. Add new strings here, not hardcoded.
- **Hook:** `src/i18n/useT.ts` — `useT()` returns `t(key, vars?)`; `useLanguage()` returns the active code. Both subscribe via `useSyncExternalStore` so components re-render the instant the user toggles.
- **State:** language lives on `Settings.language` (`packages/shared/src/types/game.ts`) and persists through the existing `settingsStore` / localStorage (`florify:v1:settings`). Default is `'th'`.
- **Toggle UI:** `src/components/LanguageToggle.tsx` — round `CornerButton` showing the current code, click to cycle. Mounted under the Gallery button in `PlotView`.
- **Scope so far:** PlotView, GalleryView, and the Settings sheet (+ all 4 sections). Florist Card, Debug, and secondary dialogs are still Thai-only — migrate them incrementally by replacing literals with `t('…')` and adding keys to both `th` and `en` in `dict.ts`.
- **Variables:** use `{name}` placeholders in dict values and pass `t('key', { name: value })`.
- **Do NOT** introduce `next-intl`, `react-i18next`, or `[locale]` route segments — they break static export or add weight for zero benefit at 2 languages.
