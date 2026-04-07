import { mulberry32 } from '@/engine/rng';
import { MISSION_POOL, DAILY_MISSION_COUNT, type DailyMission } from '@florify/shared';

/**
 * Hash a date + userId string into a uint32 seed for the seeded RNG.
 * Uses a djb2-style hash so the same player gets the same 5 missions
 * on the same day, but different players get different sets.
 */
function hashSeed(date: string, userId: string): number {
  let h = 5381;
  const combined = date + userId;
  for (let i = 0; i < combined.length; i++) {
    h = ((h << 5) + h + combined.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Pick 5 daily missions from the pool using a seeded Fisher-Yates shuffle.
 * Deterministic: same (date, userId) always produces the same 5 missions.
 */
export function pickDailyMissions(date: string, userId: string): DailyMission[] {
  const rng = mulberry32(hashSeed(date, userId));
  const pool = [...MISSION_POOL];

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }

  return pool.slice(0, DAILY_MISSION_COUNT).map((t) => ({
    templateId: t.id,
    type: t.type,
    target: t.target,
    progress: 0,
    completed: false,
  }));
}
