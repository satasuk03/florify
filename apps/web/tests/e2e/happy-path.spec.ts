import { test, expect } from '@playwright/test';

/**
 * Plant → force requiredWaterings=1 → water → harvest overlay → gallery.
 *
 * We force `requiredWaterings=1` via a direct store mutation (exposed
 * in dev via `window.__gameStore`) so the test doesn't need to step
 * through a real 30-minute cooldown. That's the canonical pattern from
 * designs/09 §9.4.
 */

test('plant → water → harvest happy path', async ({ page }) => {
  // Start clean
  await page.goto('/');
  await page.evaluate(() => {
    window.localStorage.clear();
  });
  await page.reload();

  // Plant
  const plantButton = page.getByRole('button', { name: /เริ่มปลูก/ });
  await expect(plantButton).toBeVisible();
  await plantButton.click();

  // Active tree is now on screen — the water button should be there.
  // We force requiredWaterings to 1 so a single tap harvests.
  await page.evaluate(() => {
    const store = (window as unknown as { __gameStore?: { setState: (fn: (s: any) => any) => void } }).__gameStore;
    if (!store) throw new Error('__gameStore not exposed on window — dev build required');
    store.setState((s: { state: { activeTree: { requiredWaterings: number } | null } }) => ({
      state: {
        ...s.state,
        activeTree: s.state.activeTree
          ? { ...s.state.activeTree, requiredWaterings: 1 }
          : null,
      },
    }));
  });

  // Water → should trigger harvest + celebration overlay
  const waterButton = page.getByRole('button', { name: /^รดน้ำ$/ });
  await expect(waterButton).toBeVisible();
  await waterButton.click();

  // Harvest overlay appears
  const overlay = page.getByRole('dialog', { name: /Harvest celebration/i });
  await expect(overlay).toBeVisible();

  // Dismiss back to Gallery
  await page.getByRole('button', { name: /เก็บเข้า Gallery/ }).click();
  await expect(overlay).not.toBeVisible();

  // Back at home, the plant button is available again (collection grew)
  await expect(page.getByRole('button', { name: /เริ่มปลูก/ })).toBeVisible();

  // Navigate to the Gallery — it should show 1/300 unlocked
  await page.getByRole('link', { name: /Open Gallery/i }).click();
  await expect(page).toHaveURL(/\/gallery/);
  await expect(page.getByText(/1\s*\/\s*300/)).toBeVisible();
});
