import { test, expect } from '@playwright/test';

/**
 * Flora Level happy path: seed a species with pending merges, open
 * its detail view, click Merge, assert the level badge increments.
 *
 * Uses `window.__gameStore` to seed state directly, mirroring the
 * pattern in `happy-path.spec.ts`.
 *
 * Key selectors (Thai default):
 *  - Section title: "เลเวลต้นไม้"
 *  - Merge button:  "รวม ×1"
 *  - Level badge:   "Lv 1" → "Lv 2"  (rendered as `Lv {displayLevel}`)
 *
 * Route: /gallery/detail?speciesId=0  (query param is `speciesId`, not `id`)
 */

interface DevFloraLevelEntry {
  level: 1 | 2 | 3 | 4 | 5;
  pendingMerges: number;
}

interface DevStoreState {
  collection: Array<{
    speciesId: number;
    rarity: string;
    count: number;
    totalWaterings: number;
    firstHarvestedAt: number;
    lastHarvestedAt: number;
  }>;
  floraLevels: Record<number, DevFloraLevelEntry>;
  [key: string]: unknown;
}

interface DevStore {
  getState: () => { state: DevStoreState; hydrated: boolean };
  setState: (fn: (s: { state: DevStoreState }) => { state: DevStoreState }) => void;
}

test('merging a pending duplicate advances the level badge', async ({ page }) => {
  // Start clean
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  // Wait for hydration.
  await page.waitForFunction(() => {
    const store = (window as unknown as { __gameStore?: { getState: () => { hydrated: boolean } } }).__gameStore;
    return store?.getState().hydrated === true;
  });

  // Seed a collected species (speciesId 0) at Lv 1 with 1 pending merge.
  // FLORA_LEVEL_CURVE[0] = 1, so 1 pending merge is exactly enough to
  // advance from Lv 1 → Lv 2.
  await page.evaluate(() => {
    const store = (window as unknown as { __gameStore?: DevStore }).__gameStore;
    if (!store) throw new Error('__gameStore not exposed on window — dev build required');
    const now = Date.now();
    store.setState((s) => ({
      state: {
        ...s.state,
        collection: [
          {
            speciesId: 0,
            rarity: 'common',
            count: 2,
            totalWaterings: 24,
            firstHarvestedAt: now,
            lastHarvestedAt: now,
          },
        ],
        floraLevels: { 0: { level: 1, pendingMerges: 1 } },
      },
    }));
  });

  // Navigate to the detail view of species 0.
  // The page component reads `?speciesId=` (confirmed in
  // apps/web/src/app/gallery/detail/page.tsx).
  await page.goto('/gallery/detail?speciesId=0');

  // Flora Level section should be visible. The section title in Thai
  // (default language) is "เลเวลต้นไม้".
  await expect(page.getByText('เลเวลต้นไม้')).toBeVisible();

  // The level badge starts at "Lv 1". It lives inside the Flora Level
  // section, so scope the locator to avoid ambiguity.
  const floraSection = page.locator('section').filter({ hasText: 'เลเวลต้นไม้' });
  await expect(floraSection.getByText(/^Lv 1$/)).toBeVisible();

  // Merge button (Thai "รวม ×1") should be enabled.
  const mergeButton = floraSection.getByRole('button', { name: /รวม ×1/ });
  await expect(mergeButton).toBeVisible();
  await expect(mergeButton).toBeEnabled();
  await mergeButton.click();

  // After merge: badge shows Lv 2. The tick-up animation runs 200ms
  // per step so a 2-second timeout is more than enough.
  await expect(floraSection.getByText(/^Lv 2$/)).toBeVisible({ timeout: 2000 });
});
