'use client';

import { useEffect } from 'react';
import { useGameStore, deriveSerial } from './gameStore';
import { flushSave } from './debouncedSave';
import { initMissionSubscriber } from './missionSubscriber';
import { initAchievementSubscriber } from './achievementSubscriber';
import { initAnalyticsSubscriber } from './analyticsSubscriber';
import { identify } from '@/lib/analytics';
import { checkAchievements } from './achievementChecker';
import { scheduleSave } from './debouncedSave';

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
    const cleanup = initMissionSubscriber();
    return cleanup;
  }, []);

  // Initialize achievement event subscriber (once).
  useEffect(() => {
    const cleanup = initAchievementSubscriber();
    return cleanup;
  }, []);

  // Initialize analytics event subscriber (once).
  useEffect(() => {
    const cleanup = initAnalyticsSubscriber();
    return cleanup;
  }, []);

  // Retroactive achievement unlock — runs once after hydration.
  const hydrated = useGameStore((s) => s.hydrated);

  // Send the passport serial to GA as user_id once hydrated. No displayName
  // is sent — it's user-editable free text and could contain PII.
  const userId = useGameStore((s) => s.state.userId);
  useEffect(() => {
    if (!hydrated || !userId) return;
    identify(deriveSerial(userId));
  }, [hydrated, userId]);
  useEffect(() => {
    if (!hydrated) return;
    const state = useGameStore.getState().state;
    const newlyUnlocked = checkAchievements(state);
    if (newlyUnlocked.length === 0) return;

    const now = new Date().toISOString();
    const updatedAchievements = { ...state.achievements };
    for (const def of newlyUnlocked) {
      updatedAchievements[def.id] = { unlockedAt: now };
    }

    const next = { ...state, achievements: updatedAchievements, updatedAt: Date.now() };
    useGameStore.setState({ state: next });
    scheduleSave(next);
  }, [hydrated]);

  // Initial hydrate on mount.
  useEffect(() => {
    hydrate().catch((err) => console.error('[StoreHydrator] hydrate failed', err));
  }, [hydrate]);

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

  // Reset daily state when midnight crosses while tab is open.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const scheduleNextMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const ms = midnight.getTime() - now.getTime() + 500; // +500ms buffer

      timer = setTimeout(() => {
        checkinStreak();
        ensureDailyMissions();
        scheduleNextMidnight(); // re-arm for next day
      }, ms);
    };

    scheduleNextMidnight();
    return () => clearTimeout(timer);
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
