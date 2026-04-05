import { SCHEMA_VERSION, type PlayerState } from '@florify/shared';

type UnknownState = { schemaVersion: number } & Record<string, unknown>;

/**
 * Schema migration framework. Each future migration bumps one version
 * at a time — keep this pattern in place from day one so shipping
 * breaking schema changes doesn't corrupt player saves.
 */
export function migrate(state: UnknownState): PlayerState {
  let s = state;
  if (s.schemaVersion === 1) s = migrateV1toV2(s);
  if (s.schemaVersion !== SCHEMA_VERSION) {
    console.warn(`[migrate] unknown schemaVersion ${s.schemaVersion}, falling back to as-is`);
  }
  return s as unknown as PlayerState;
}

// v1 → v2: add `displayName` field (default "Guest" for existing saves)
function migrateV1toV2(s: UnknownState): UnknownState {
  return { ...s, schemaVersion: 2, displayName: 'Guest' };
}
