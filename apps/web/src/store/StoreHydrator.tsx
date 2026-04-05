'use client';

import { useEffect } from 'react';
import { COOLDOWN_MS } from '@/lib/debug';
import { useGameStore } from './gameStore';
import { flushSave } from './debouncedSave';
import { scheduleCooldownNotification } from '@/lib/notifications';

/**
 * Root-level hydrator. Mounted once from `app/layout.tsx` so:
 *   - every route benefits from `hydrate()` without re-running it
 *   - the visibility + beforeunload listeners live at one place
 *
 * Renders nothing; all work happens in effects.
 */
export function StoreHydrator() {
  const hydrate = useGameStore((s) => s.hydrate);
  const checkinStreak = useGameStore((s) => s.checkinStreak);

  // Expose the store on window in non-production builds so Playwright
  // e2e tests can force state (e.g. requiredWaterings=1 to skip the
  // 30-minute cooldown). Designs/09 §9.4.
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as { __gameStore?: typeof useGameStore }).__gameStore = useGameStore;
    }
  }, []);

  // Initial hydrate on mount. Once state is loaded, if there's an
  // active tree with a pending cooldown, re-arm the in-tab notification
  // so the user still gets pinged even after a page refresh.
  useEffect(() => {
    hydrate()
      .then(() => {
        const tree = useGameStore.getState().state.activeTree;
        if (tree?.lastWateredAt) {
          scheduleCooldownNotification(tree.lastWateredAt + COOLDOWN_MS);
        }
      })
      .catch((err) => console.error('[StoreHydrator] hydrate failed', err));
  }, [hydrate]);

  // Re-run streak check + re-arm the cooldown notification when the
  // tab comes back to foreground. Browsers throttle long setTimeout in
  // backgrounded tabs, so the original notification may have drifted.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      checkinStreak();
      const tree = useGameStore.getState().state.activeTree;
      if (tree?.lastWateredAt) {
        scheduleCooldownNotification(tree.lastWateredAt + COOLDOWN_MS);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [checkinStreak]);

  // Flush any pending debounced save before the tab is killed
  useEffect(() => {
    const onBeforeUnload = () => {
      flushSave(useGameStore.getState().state);
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  return null;
}
