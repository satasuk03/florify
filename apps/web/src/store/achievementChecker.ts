import type { AchievementCondition, AchievementDef, PlayerState } from '@florify/shared';
import { ACHIEVEMENTS } from '@/data/achievements';
import { SPECIES } from '@/data/species';

/**
 * Evaluate all achievement conditions against current player state.
 * Returns the list of AchievementDefs that are newly met (not yet in state.achievements).
 * Pure function — does not mutate state.
 */
export function checkAchievements(state: PlayerState): AchievementDef[] {
  const newly: AchievementDef[] = [];

  for (const def of ACHIEVEMENTS) {
    if (state.achievements[def.id]) continue;
    if (evaluateCondition(def.condition, state)) {
      newly.push(def);
    }
  }

  return newly;
}

function evaluateCondition(cond: AchievementCondition, state: PlayerState): boolean {
  switch (cond.type) {
    case 'species_unlocked':
      return state.collection.length >= cond.target;

    case 'species_by_rarity':
      return state.collection.filter((s) => s.rarity === cond.rarity).length >= cond.target;

    case 'species_by_collection': {
      const speciesInCollection = new Set(
        SPECIES.filter((s) => s.collection === cond.collection).map((s) => s.id),
      );
      return state.collection.filter((s) => speciesInCollection.has(s.speciesId)).length >= cond.target;
    }

    case 'harvest_total':
      return state.stats.totalHarvested >= cond.target;

    case 'harvest_by_rarity':
      return state.stats.harvestByRarity[cond.rarity] >= cond.target;

    case 'total_watered':
      return state.stats.totalWatered >= cond.target;

    case 'sprouts_gained':
      return state.stats.sproutsGained >= cond.target;

    case 'sprouts_spent':
      return state.stats.sproutsSpent >= cond.target;

    case 'streak':
      return state.streak.longestStreak >= cond.target;

    case 'combo': {
      const key = `combo${cond.level}` as keyof typeof state.stats.comboCount;
      return state.stats.comboCount[key] >= cond.target;
    }

    case 'seed_packets':
      return state.stats.seedPacketsOpened[cond.tier] >= cond.target;

    case 'missions_completed':
      return (state.stats.missionsCompleted ?? 0) >= cond.target;

    case 'all_daily_completed':
      return (state.stats.allDailyMissionsCompleted ?? 0) >= cond.target;

    case 'secret':
      return false;

    default:
      return false;
  }
}

/**
 * Get current progress value for a given condition.
 * Used by UI to show progress bars.
 */
export function getConditionProgress(cond: AchievementCondition, state: PlayerState): number {
  switch (cond.type) {
    case 'species_unlocked':
      return state.collection.length;
    case 'species_by_rarity':
      return state.collection.filter((s) => s.rarity === cond.rarity).length;
    case 'species_by_collection': {
      const ids = new Set(
        SPECIES.filter((s) => s.collection === cond.collection).map((s) => s.id),
      );
      return state.collection.filter((s) => ids.has(s.speciesId)).length;
    }
    case 'harvest_total':
      return state.stats.totalHarvested;
    case 'harvest_by_rarity':
      return state.stats.harvestByRarity[cond.rarity];
    case 'total_watered':
      return state.stats.totalWatered;
    case 'sprouts_gained':
      return state.stats.sproutsGained;
    case 'sprouts_spent':
      return state.stats.sproutsSpent;
    case 'streak':
      return state.streak.longestStreak;
    case 'combo': {
      const key = `combo${cond.level}` as keyof typeof state.stats.comboCount;
      return state.stats.comboCount[key];
    }
    case 'seed_packets':
      return state.stats.seedPacketsOpened[cond.tier];
    case 'missions_completed':
      return state.stats.missionsCompleted ?? 0;
    case 'all_daily_completed':
      return state.stats.allDailyMissionsCompleted ?? 0;
    case 'secret':
      return 0;
    default:
      return 0;
  }
}
