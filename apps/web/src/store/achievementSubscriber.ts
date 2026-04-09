import type { GameEvent } from '@florify/shared';
import { gameEventBus } from '@/lib/gameEventBus';
import { useGameStore } from './gameStore';
import { checkAchievements } from './achievementChecker';
import { toast } from '@/lib/toast';

/**
 * Subscribes to game events and checks for newly unlocked achievements.
 * Also tracks combo counts (not tracked elsewhere).
 * Mirrors the pattern of missionSubscriber.ts.
 */

function handleEvent(event: GameEvent) {
  const store = useGameStore.getState();
  let state = store.state;

  // Track combo counts — these aren't tracked by the main store actions
  if (event.type === 'combo') {
    const level = event.level as 10 | 15 | 20;
    const key = `combo${level}` as keyof typeof state.stats.comboCount;
    if (key in state.stats.comboCount) {
      state = {
        ...state,
        stats: {
          ...state.stats,
          comboCount: {
            ...state.stats.comboCount,
            [key]: state.stats.comboCount[key] + 1,
          },
        },
      };
    }
  }

  const newlyUnlocked = checkAchievements(state);

  if (newlyUnlocked.length > 0) {
    const now = new Date().toISOString();
    const updatedAchievements = { ...state.achievements };
    for (const def of newlyUnlocked) {
      updatedAchievements[def.id] = { unlockedAt: now };
    }
    state = { ...state, achievements: updatedAchievements, updatedAt: Date.now() };
  }

  // Only update store if state changed
  if (state !== store.state) {
    useGameStore.setState({ state });
  }

  // Fire toast after state update
  if (newlyUnlocked.length === 1) {
    toast(`🏆 ${newlyUnlocked[0]!.name}`);
  } else if (newlyUnlocked.length > 1) {
    toast(`🏆 ${newlyUnlocked.length} achievements unlocked!`);
  }
}

let initialized = false;

export function initAchievementSubscriber(): () => void {
  if (initialized) return () => {};
  initialized = true;
  gameEventBus.on(handleEvent);
  return () => {
    gameEventBus.off(handleEvent);
    initialized = false;
  };
}
