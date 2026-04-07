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
      break;
    case 'visit':
      if (event.screen === 'gallery') trackMission('visit_gallery');
      else if (event.screen === 'floripedia') trackMission('visit_floripedia');
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
