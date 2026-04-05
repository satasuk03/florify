import type { PlayerState } from '@florify/shared';
import { migrate } from '@/store/migrations';

/**
 * Export/import of player saves as a compact ASCII string.
 *
 * Wire format:
 *   "florify1:" + base64( gzip( utf8( JSON(envelope) ) ) )
 *
 * - Visible `florify1:` prefix lets users (and us) recognize the
 *   string at a glance and rejects wrong pastes before we pay for
 *   base64-decode + gunzip. The trailing `1` is a wire-format version
 *   so future bumps (e.g. switching compression algo) don't collide.
 * - gzip is essential: the game state is extremely repetitive (every
 *   `TreeInstance` has the same field names), so a save with dozens
 *   of harvested trees compresses to ~15-25% of the raw JSON size.
 * - `CompressionStream`/`DecompressionStream` are native web APIs
 *   (Chrome 80+, Safari 16.4+, Firefox 113+) — no polyfill needed.
 * - The envelope carries its own magic string `format: "florify-save"`
 *   so even if someone strips the prefix and feeds us raw base64 of a
 *   different JSON, we still fail fast with a clear error.
 */

const WIRE_PREFIX = 'florify1:';
const MAGIC = 'florify-save';
const FORMAT_VERSION = 1;

interface Envelope {
  format: typeof MAGIC;
  formatVersion: number;
  exportedAt: number;
  schemaVersion: number;
  state: PlayerState;
}

export async function exportSaveString(state: PlayerState): Promise<string> {
  const envelope: Envelope = {
    format: MAGIC,
    formatVersion: FORMAT_VERSION,
    exportedAt: Date.now(),
    schemaVersion: state.schemaVersion,
    state,
  };
  const json = JSON.stringify(envelope);
  const compressed = await gzip(new TextEncoder().encode(json));
  return WIRE_PREFIX + bytesToBase64(compressed);
}

export type ImportResult =
  | { ok: true; state: PlayerState }
  | { ok: false; reason: string };

export async function importSaveString(raw: string): Promise<ImportResult> {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, reason: 'ไม่มีข้อมูลให้นำเข้า' };

  if (!trimmed.startsWith(WIRE_PREFIX)) {
    return { ok: false, reason: 'ไม่ใช่รหัส save ของ florify' };
  }
  const payload = trimmed.slice(WIRE_PREFIX.length);

  let compressedBytes: Uint8Array;
  try {
    compressedBytes = base64ToBytes(payload);
  } catch {
    return { ok: false, reason: 'รูปแบบ base64 ไม่ถูกต้อง' };
  }

  let json: string;
  try {
    const plain = await gunzip(compressedBytes);
    json = new TextDecoder().decode(plain);
  } catch {
    return { ok: false, reason: 'ถอดรหัส gzip ไม่ได้' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, reason: 'อ่านข้อมูล JSON ไม่ได้' };
  }

  if (!isEnvelope(parsed)) {
    return { ok: false, reason: 'ไม่ใช่ไฟล์ save ของ florify' };
  }

  if (parsed.formatVersion > FORMAT_VERSION) {
    return {
      ok: false,
      reason: `ไฟล์ save ใหม่กว่าที่แอพรองรับ (v${parsed.formatVersion})`,
    };
  }

  // Let `migrate()` handle schema drift on the inner state. If it
  // throws, wrap the error so the UI can surface it cleanly.
  let migrated: PlayerState;
  try {
    const stateLike = parsed.state as unknown as { schemaVersion: number } & Record<
      string,
      unknown
    >;
    migrated = migrate(stateLike);
  } catch (err) {
    return {
      ok: false,
      reason: `migration ล้มเหลว: ${err instanceof Error ? err.message : 'unknown'}`,
    };
  }

  // Minimal shape check — `migrate()` casts to PlayerState without
  // verifying structure, so a malformed payload could still slip
  // through without this guard.
  if (
    typeof migrated !== 'object' ||
    migrated === null ||
    !Array.isArray((migrated as PlayerState).collection) ||
    typeof (migrated as PlayerState).userId !== 'string'
  ) {
    return { ok: false, reason: 'โครงสร้างข้อมูลผู้เล่นไม่ครบ' };
  }

  return { ok: true, state: migrated };
}

// ── gzip via CompressionStream ───────────────────────────────────────

async function gzip(input: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([input as BlobPart]).stream().pipeThrough(
    new CompressionStream('gzip'),
  );
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

async function gunzip(input: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([input as BlobPart]).stream().pipeThrough(
    new DecompressionStream('gzip'),
  );
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

// ── base64 <-> bytes (unicode-safe, works on binary too) ─────────────

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function isEnvelope(v: unknown): v is Envelope {
  if (typeof v !== 'object' || v === null) return false;
  const e = v as Record<string, unknown>;
  return (
    e.format === MAGIC &&
    typeof e.formatVersion === 'number' &&
    typeof e.exportedAt === 'number' &&
    typeof e.schemaVersion === 'number' &&
    typeof e.state === 'object' &&
    e.state !== null
  );
}
