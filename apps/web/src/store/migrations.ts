import { MAX_WATER_DROPS, SCHEMA_VERSION, type PlayerState } from '@florify/shared';

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
