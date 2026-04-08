import type { GameEvent } from '@florify/shared';
import { gameEventBus } from '@/lib/gameEventBus';
import { useGameStore } from './gameStore';

/**
 * Subscribes to the game event bus and maps events to mission progress.
 * Called once from StoreHydrator on mount. Returns a cleanup function
 * that unregisters the listener (important for HMR and testing).
 */

function handleEvent(event: GameEvent) {
  const { trackMission } = useGameStore.getState();

  switch (event.type) {
    case 'water':
      trackMission('water');
      break;
    case 'plant':
      trackMission('plant');
      break;
    case 'harvest':
      trackMission('harvest');
      if (event.rarity === 'rare' || event.rarity === 'legendary') {
        trackMission('harvest_rare');
      }
      if (event.rarity === 'legendary') {
        trackMission('harvest_legendary');
      }
      break;
    case 'combo':
      if (event.level >= 10) trackMission('combo10');
      if (event.level >= 15) trackMission('combo15');
      if (event.level >= 20) trackMission('combo20');
      break;
    case 'visit':
      trackMission('visit_floripedia');
      break;
    case 'share':
      trackMission('share_florist_card');
      break;
  }
}

let initialized = false;

export function initMissionSubscriber(): () => void {
  if (initialized) return () => {};
  initialized = true;
  gameEventBus.on(handleEvent);
  return () => {
    gameEventBus.off(handleEvent);
    initialized = false;
  };
}
