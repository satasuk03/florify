# Florify — TODO / Backlog

Living list of outstanding work, polish gaps, and deferred features surfaced during Phase 1–6 implementation. Organized by rough urgency. Phases in parentheses reference when each item was deferred / flagged.

Status legend: `[ ]` not started · `[~]` partially landed · `[x]` done

---

## 🐛 Polish gaps flagged during implementation

- [ ] **`animate-pulse-slow` keyframe missing** (Phase 6) — `HarvestOverlay.tsx` references the class for the radial glow pulse but Tailwind v4 doesn't ship that preset. Currently the glow renders statically (fine for reduced-motion, but animated users should see it breathe). Fix: add a 4-line `@theme` + `@keyframes` block in `apps/web/src/app/globals.css`.
- [ ] **Gallery thumbnail rendering isn't IntersectionObserver-gated** (Phase 5) — each `GalleryTile` calls `renderThumbnail` in its own `useEffect` on mount. With 50+ trees on screen this bursts ~100ms/tile of main-thread work. Fix: wrap the render in an `IntersectionObserver` so only visible tiles rasterize. Referenced in `designs/07-screens.md` §7.7.
- [ ] **Leaf growth is CPU-driven, not a shader** (Phase 4) — `TreeMesh` walks every leaf instance per frame via `applyProgress`. Fine for common/rare (≤ 500 leaves), might drop frames on legendary species on low-end Android. Upgrade path: custom `ShaderMaterial` with `aBirthThreshold` instanced attribute + `uProgress` uniform — the `built.leafBirthThresholds` data is already shaped for it.
- [ ] **Drei v9 → v10 peer warning cleanup** (Phase 1 → Phase 4) — bumped during Phase 4. Double-check no stale warnings linger after `pnpm install` from a cold store.
- [ ] **Testing-library deps missing from `package.json`** (Phase 6) — `@testing-library/react` and `@testing-library/jest-dom` were removed by a linter sweep. Re-add if / when component tests land.

---

## 🎯 Deferred features (planned, not yet built)

- [ ] **Cloud sync — `apps/api` Cloudflare Workers + D1** (designs/10, Phase 7)
  - Magic-link auth via MailChannels
  - `CompositeSaveStore` (local-first with async cloud push)
  - Conflict resolution (last-writer-wins + union merge for collection)
  - Web Push via service worker + cron (replaces in-tab `setTimeout` notifications)
  - Shared types: `apps/api` imports `@florify/shared` for `PlayerState` validation
- [ ] **Optional featured-tree hero on the Florist Card** (designs/11 §11.5) — a single leaf silhouette at ~25% opacity behind the hero number, picked deterministically from the player's unlocked species (`userId % collection.length`). Skipped in v1 to keep the share image text-forward. Revisit after we have real players screenshotting the card.
- [ ] **Display name (not just "Guest")** (designs/11 §11.3) — the `FloristCardData.displayName` field exists but is hardcoded `'Guest'`. Phase 7 wires it to cloud auth. Pre-Phase-7 alternative: a text input in Settings that writes to `settingsStore` or `PlayerState.displayName` (schema bump).
- [ ] **Sharing analytics hooks** (designs/11 §11.10) — stub the event names (`florist_card_opened`, `florist_card_share_started`, `florist_card_share_result`) at the call sites so wiring analytics later is a one-liner.
- [x] **Harvest particles / confetti** (designs/07 §7.11) — `HarvestConfetti.tsx` renders a rarity-tiered leaf + sparkle burst (common: 8 leaves; rare: 14 leaves + 6 sparkles; legendary: 22 leaves + 14 gold sparkles). Pure CSS keyframes in `globals.css` (`confetti-leaf`, `confetti-sparkle`), deterministic PRNG seeded on `tree.id`, and a `prefers-reduced-motion` guard that skips rendering entirely.
- [ ] **Settings: sound toggle is UI-only** (Phase 6) — the toggle persists but nothing reads `settings.sound` yet because there are no sound assets. Deferred per `designs/00-overview.md` §✅ — asset pipeline is waiting on the user.

---

## 🧪 Testing gaps

- [ ] **Actually run the Playwright e2e suite** (Phase 6) — the test + config ship ready to go. First run needs `pnpm --filter @florify/web exec playwright install chromium` (~150MB) followed by `pnpm --filter @florify/web test:e2e`. Not run in this session.
- [ ] **Component tests for UI primitives** — `Button`, `Card`, `RarityBadge`, `CountdownTimer`, `CornerButton`, `Toggle` all have zero tests. They're all thin enough that snapshot + a few prop-driven assertions would suffice.
- [ ] **Playwright coverage beyond happy path** — designs/09 §9.4 only specified the plant→water→harvest flow. Add: cooldown-blocks-water, Florist Card opens + shows correct serial, share button falls back to download in desktop Chromium, gallery navigation preserves scroll, settings reset clears state.
- [ ] **Visual regression for passport image** — snapshot test the `buildLayout` output is already in place. Next step: render `renderPassportImage` in a real browser context (Playwright page.evaluate) and snapshot the PNG.
- [ ] **Coverage thresholds** (designs/09 §9.2) — `vitest.config.ts` doesn't enforce coverage gates yet. Add `test.coverage.thresholds: { lines: 75, ... }` per the step doc.
- [ ] **CI workflow** (designs/09 §9.5) — no `.github/workflows/ci.yml` yet. Should run `lint`, `typecheck`, `test`, `build`, `test:e2e` on push/PR.

---

## 🎨 UX / design refinements

- [ ] **Harvest overlay auto-dismiss timer** — currently sticks around forever until tapped. Add an optional 8s auto-dismiss for users who get distracted mid-celebration.
- [ ] **Gallery empty state illustration** — currently a single Thai sentence. A small SVG of an empty pot would sell the aspiration.
- [ ] **Detail view: add species description / flavor text** — we have the species name and seed but no lore. Could be a 1-sentence procedurally-generated description keyed on rarity + leaf palette.
- [ ] **Plant button: species reveal animation** — planting currently just swaps empty pot → tiny tree. A 1-second "seed falls + sprouts" animation would sell the moment.
- [ ] **Cooldown countdown: last 10s urgency styling** — turn the timer text leaf-500 (green) in the last 10 seconds before unlock, matching the Ready-to-water moment.
- [ ] **Florist Card modal: desktop width cap** — on wide screens the modal gets wider than looks good. Cap at ~420px and center.

---

## 🔧 Dev ergonomics

- [ ] **Root `pnpm dev` should also kick off `@florify/shared` typecheck in watch** — currently only `apps/web` runs in watch. Low priority; shared barely changes.
- [ ] **Pre-commit hook** — `lint-staged` + `husky` for `typecheck` + `test` on changed files. After testing coverage settles.
- [ ] **Storybook / component playground** (designs/02 §2.7) — optional; useful if component count grows past ~20.
- [ ] **Seed the dev `window.__gameStore` hook with fixtures** — right now e2e tests bypass cooldown by overwriting `requiredWaterings`. A dev helper `window.__dev.seedHarvested(count)` / `window.__dev.unlockAllRarities()` would speed up visual QA.

---

## 📚 Docs

- [ ] **Update `designs/11-florist-card.md` with the `useMemo + selectFloristCard(state)` pattern** — the doc still references `useGameStore(s => s.selectFloristCard())` in the sketch. Real implementation had to back away from that because it tripped React's `getServerSnapshot` caching. Add a "Pitfall" section so future work doesn't repeat the mistake.
- [ ] **README quickstart** — `pnpm install && pnpm dev` is in the root README but doesn't mention the `@florify/web` workspace filter variants (`pnpm --filter @florify/web test`, etc).
- [ ] **Architecture diagram** — designs/00 has a text roadmap but no picture. A single Mermaid diagram showing the monorepo layout + data flow (player action → gameStore → saveStore + localStorage + cloud future) would help onboarding.

---

## ✅ Done this session (for context)

- Phase 1 Foundation — monorepo scaffold + design tokens + data model
- Phase 2 Tree Generator — deterministic L-system + 300 species + LRU cache
- Phase 3 Game Logic — Zustand store + plant/water/harvest/streak + tests
- Phase 4 3D Rendering — R3F scene + growth animation + thumbnail renderer
- Phase 5 Screens & UI — PlotView corner layout + Gallery + Detail + **Florist Card shareable passport with Canvas 2D image generation**
- Phase 6 Mobile Polish & Testing — haptics + notifications + harvest overlay + settings + Playwright smoke test
- `designs/11-florist-card.md` — new step doc for the passport feature
- Bug fix: `selectFloristCard` moved out of Zustand selector into a pure function (infinite loop fix)
