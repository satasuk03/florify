import type { BoosterTier, GameEvent } from '@florify/shared';
import {
  BOOSTER_COST_COMMON,
  BOOSTER_COST_LEGENDARY,
  BOOSTER_COST_RARE,
  COSMETIC_BOX_COST,
} from '@florify/shared';
import { gameEventBus } from '@/lib/gameEventBus';
import { trackEvent } from '@/lib/analytics';

/**
 * Forwards game-bus events to Google Analytics 4. Mirrors missionSubscriber /
 * achievementSubscriber — one `gameEventBus.on` handler wired up once from
 * StoreHydrator.
 *
 * Parameter names use snake_case because GA4's reporting UI treats them as
 * custom event parameters and lower-cases them anyway.
 */

const BOOSTER_COST: Record<BoosterTier, number> = {
  common: BOOSTER_COST_COMMON,
  rare: BOOSTER_COST_RARE,
  legendary: BOOSTER_COST_LEGENDARY,
};

function handleEvent(event: GameEvent) {
  switch (event.type) {
    case 'harvest':
      trackEvent('flora_harvested', {
        species_id: event.speciesId,
        rarity: event.rarity,
        is_new: event.isNew,
      });
      break;
    case 'booster_open':
      trackEvent('seed_packet_opened', {
        tier: event.tier,
        cost: BOOSTER_COST[event.tier],
        currency: 'sprouts',
        rarity: event.rarity,
        is_new: event.isNew,
      });
      break;
    case 'cosmetic_box_open':
      trackEvent('cosmetic_box_opened', {
        box_type: event.boxType,
        cost: COSMETIC_BOX_COST,
        currency: 'gold',
        drop_kind: event.dropKind,
        ...(event.rarity ? { rarity: event.rarity } : {}),
        ...(event.isNew !== undefined ? { is_new: event.isNew } : {}),
      });
      break;
    case 'mission_claim':
      trackEvent('quest_claimed', {
        milestone: event.milestone,
        drops_awarded: event.dropsAwarded,
      });
      break;
    case 'mission_all_complete':
      trackEvent('quest_all_complete', {
        sprouts_awarded: event.sproutsAwarded,
      });
      break;
  }
}

let initialized = false;

export function initAnalyticsSubscriber(): () => void {
  if (initialized) return () => {};
  initialized = true;
  gameEventBus.on(handleEvent);
  return () => {
    gameEventBus.off(handleEvent);
    initialized = false;
  };
}
