'use client';

import { useEffect } from 'react';
import { useGameStore } from './gameStore';
import { flushSave } from './debouncedSave';
import { initMissionSubscriber } from './missionSubscriber';

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
  const ensureDailyMissions = useGameStore((s) => s.ensureDailyMissions);

  // Expose the store on window in non-production builds so Playwright
  // e2e tests can force state (e.g. requiredWaterings=1 to skip many
  // water taps). Designs/09 §9.4.
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as { __gameStore?: typeof useGameStore }).__gameStore = useGameStore;
    }
  }, []);

  // Initialize mission event subscriber (once).
  useEffect(() => {
    initMissionSubscriber();
  }, []);

  // Initial hydrate on mount.
  useEffect(() => {
    hydrate()
      .then(() => ensureDailyMissions())
      .catch((err) => console.error('[StoreHydrator] hydrate failed', err));
  }, [hydrate, ensureDailyMissions]);

  // Re-run streak check when the tab comes back to foreground. Also
  // forces a re-render so `computeDrops` picks up elapsed time and
  // the UI shows updated drop counts.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      checkinStreak();
      ensureDailyMissions();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [checkinStreak, ensureDailyMissions]);

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
