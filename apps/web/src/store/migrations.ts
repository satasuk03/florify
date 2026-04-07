import { MAX_WATER_DROPS, SCHEMA_VERSION, type PlayerState, type CollectedSpecies, type Rarity } from '@florify/shared';

type UnknownState = { schemaVersion: number } & Record<string, unknown>;

/**
 * Schema migration framework. Each future migration bumps one version
 * at a time — keep this pattern in place from day one so shipping
 * breaking schema changes doesn't corrupt player saves.
 */
export function migrate(state: UnknownState): PlayerState {
  let s = state;
  if (s.schemaVersion === 1) s = migrateV1toV2(s);
  if (s.schemaVersion === 2) s = migrateV2toV3(s);
  if (s.schemaVersion === 3) s = migrateV3toV4(s);
  if (s.schemaVersion === 4) s = migrateV4toV5(s);
  if (s.schemaVersion === 5) s = migrateV5toV6(s);
  if (s.schemaVersion === 6) s = migrateV6toV7(s);
  if (s.schemaVersion !== SCHEMA_VERSION) {
    console.warn(`[migrate] unknown schemaVersion ${s.schemaVersion}, falling back to as-is`);
  }
  return s as unknown as PlayerState;
}

// v1 → v2: add `displayName` field (default "Guest" for existing saves)
function migrateV1toV2(s: UnknownState): UnknownState {
  return { ...s, schemaVersion: 2, displayName: 'Guest' };
}

// v2 → v3: replace cooldown system with water drops resource pool.
// Grant existing players a full drop tank. Strip `lastWateredAt` from
// the active tree (field no longer exists on TreeInstance). In-progress
// trees keep their current requiredWaterings — they'll finish under
// the old low count, then the next plant uses the new 12-20 range.
function migrateV2toV3(s: UnknownState): UnknownState {
  const now = Date.now();
  const result: UnknownState = {
    ...s,
    schemaVersion: 3,
    waterDrops: MAX_WATER_DROPS,
    lastDropRegenAt: now,
  };

  // Strip lastWateredAt from active tree
  if (result.activeTree && typeof result.activeTree === 'object') {
    const tree = { ...(result.activeTree as Record<string, unknown>) };
    delete tree.lastWateredAt;
    result.activeTree = tree;
  }

  return result;
}

// v3 → v4: aggregate collection from TreeInstance[] to CollectedSpecies[].
// Group by speciesId, summing waterings and tracking first/last harvest times.
function migrateV3toV4(s: UnknownState): UnknownState {
  const oldCollection = (s.collection ?? []) as Array<{
    speciesId: number;
    rarity: Rarity;
    requiredWaterings: number;
    harvestedAt: number | null;
  }>;

  const map = new Map<number, CollectedSpecies>();
  for (const tree of oldCollection) {
    const harvestedAt = tree.harvestedAt ?? 0;
    const existing = map.get(tree.speciesId);
    if (existing) {
      existing.count += 1;
      existing.totalWaterings += tree.requiredWaterings;
      if (harvestedAt < existing.firstHarvestedAt) existing.firstHarvestedAt = harvestedAt;
      if (harvestedAt > existing.lastHarvestedAt) existing.lastHarvestedAt = harvestedAt;
    } else {
      map.set(tree.speciesId, {
        speciesId: tree.speciesId,
        rarity: tree.rarity,
        count: 1,
        totalWaterings: tree.requiredWaterings,
        firstHarvestedAt: harvestedAt,
        lastHarvestedAt: harvestedAt,
      });
    }
  }

  // Sort by lastHarvestedAt desc
  const collection = [...map.values()].sort((a, b) => b.lastHarvestedAt - a.lastHarvestedAt);

  return { ...s, schemaVersion: 4, collection };
}

// v4 → v5: add pity points (dried leaves 🍂) counter for bad-luck protection.
function migrateV4toV5(s: UnknownState): UnknownState {
  return { ...s, schemaVersion: 5, pityPoints: 0 };
}

// v5 → v6: add daily missions system.
function migrateV5toV6(s: UnknownState): UnknownState {
  return {
    ...s,
    schemaVersion: 6,
    dailyMissions: {
      date: '',
      missions: [],
      claimedPoints: 0,
      claimedMilestones: [],
    },
  };
}

// v6 → v7: add lastRewardDate to streak for daily check-in rewards.
function migrateV6toV7(s: UnknownState): UnknownState {
  const streak = (s.streak ?? {}) as Record<string, unknown>;
  return {
    ...s,
    schemaVersion: 7,
    streak: { ...streak, lastRewardDate: '' },
  };
}
