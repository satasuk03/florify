import type { FloristCardData, FloristRank } from '@/store/gameStore';
import { SPECIES_BY_ID, SPECIES_BY_RARITY } from '@/data/species';
import { gzip, gunzip } from './saveTransfer';

/**
 * Self-contained shareable passport links.
 *
 * Wire format (lives in the URL *fragment*, never sent to the server):
 *   "fp1:" + base64url( gzip( utf8( JSON(packed) ) ) )
 *
 * Why in the fragment:
 * - Static export + no backend means we can't persist serials → data.
 *   Embedding the passport directly in the link is the only way to make
 *   `/p/#…` self-render for recipients who've never opened Florify.
 * - The fragment never reaches the server, so it stays out of analytics,
 *   access logs, and referer headers.
 *
 * Why a distinct `fp1:` prefix (vs `florify1:` for saves):
 * - A save string pasted into a passport link (or vice versa) fails
 *   fast with a clear error instead of running through the wrong decoder.
 * - The trailing `1` reserves a wire-format bump path.
 *
 * What's *not* in the payload:
 * - `userId` — only the public, non-reversible `serial` derived from
 *   it is shared, so recipients can't impersonate the owner once cloud
 *   auth lands.
 * - Rarity totals — they're derived from `SPECIES_BY_RARITY` so adding
 *   or removing species in the catalogue updates every shared link
 *   automatically, no wire-format bump required.
 */

const WIRE_PREFIX = 'fp1:';
const FORMAT_VERSION = 1;

const VALID_RANKS: readonly FloristRank[] = [
  'Seedling',
  'Apprentice',
  'Gardener',
  'Master',
  'Legend',
];

/** Short-keyed payload — pre-gzip JSON size dominates for tiny inputs. */
interface PackedPayload {
  v: number; // format version
  s: string; // serial (FL-xxxx-xxxx)
  n: string; // displayName
  r: FloristRank; // rank
  u: number; // speciesUnlocked
  h: number; // totalHarvested
  c: number; // currentStreak
  l: number; // longestStreak
  rc: number; // rarity common unlocked
  rr: number; // rarity rare unlocked
  rl: number; // rarity legendary unlocked
  t: number; // startedAt (epoch ms)
  d?: number; // sharedAt (epoch ms) — when the snapshot was taken
  /** Custom title text (resolved, not achievement id). Omitted when
   *  title === rank so the owner's "auto" choice stays snapshot-clean. */
  ti?: string;
  /** Avatar: {speciesId, stage}. Absent = placeholder. */
  av?: { i: number; g: 1 | 2 | 3 };
}

export type DecodeResult =
  | { ok: true; data: FloristCardData }
  | { ok: false; reason: string };

// ── Encode ───────────────────────────────────────────────────────────

/** Returns the encoded payload body only (without prefix or URL). */
export async function encodePassportPayload(data: FloristCardData): Promise<string> {
  const packed: PackedPayload = {
    v: FORMAT_VERSION,
    s: data.serial,
    n: data.displayName,
    r: data.rank,
    u: data.speciesUnlocked,
    h: data.totalHarvested,
    c: data.currentStreak,
    l: data.longestStreak,
    rc: data.rarityProgress.common.unlocked,
    rr: data.rarityProgress.rare.unlocked,
    rl: data.rarityProgress.legendary.unlocked,
    t: data.startedAt,
    d: Date.now(),
    // Only bake `ti` when the user explicitly chose a non-rank title —
    // keeps auto-mode links byte-compatible with pre-customization v1.
    ...(data.title !== data.rank ? { ti: data.title } : {}),
    ...(data.avatar
      ? { av: { i: data.avatar.speciesId, g: data.avatar.stage } }
      : {}),
  };
  const json = JSON.stringify(packed);
  const compressed = await gzip(new TextEncoder().encode(json));
  return WIRE_PREFIX + bytesToBase64Url(compressed);
}

/**
 * Build a fully-qualified passport URL for the given card.
 *
 * `origin` defaults to `window.location.origin` — callers on the server
 * (currently none, since this route is client-only) must pass an origin.
 */
export async function encodePassportLink(
  data: FloristCardData,
  origin?: string,
): Promise<string> {
  const body = await encodePassportPayload(data);
  const base =
    origin ?? (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/p/#${body}`;
}

// ── Decode ───────────────────────────────────────────────────────────

/**
 * Decode a raw hash string (with or without a leading `#`) into
 * `FloristCardData`. Never throws — tamper/garbage input produces a
 * clean `{ ok: false, reason }` the UI can surface.
 */
export async function decodePassportLink(hash: string): Promise<DecodeResult> {
  const trimmed = hash.trim().replace(/^#/, '');
  if (!trimmed) return { ok: false, reason: 'ไม่มีข้อมูลในลิงค์' };

  if (!trimmed.startsWith(WIRE_PREFIX)) {
    return { ok: false, reason: 'ลิงค์พาสปอร์ตไม่ถูกต้อง' };
  }
  const body = trimmed.slice(WIRE_PREFIX.length);

  let compressed: Uint8Array;
  try {
    compressed = base64UrlToBytes(body);
  } catch {
    return { ok: false, reason: 'ถอดรหัสลิงค์ไม่ได้' };
  }

  let json: string;
  try {
    const plain = await gunzip(compressed);
    json = new TextDecoder().decode(plain);
  } catch {
    return { ok: false, reason: 'ข้อมูลในลิงค์เสียหาย' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, reason: 'อ่านข้อมูลพาสปอร์ตไม่ได้' };
  }

  const packed = validatePacked(parsed);
  if (!packed) {
    return { ok: false, reason: 'โครงสร้างพาสปอร์ตไม่ถูกต้อง' };
  }

  if (packed.v > FORMAT_VERSION) {
    return { ok: false, reason: `ลิงค์รุ่นใหม่กว่าที่รองรับ (v${packed.v})` };
  }

  return { ok: true, data: unpack(packed) };
}

function unpack(p: PackedPayload): FloristCardData {
  return {
    rank: p.r,
    speciesUnlocked: p.u,
    totalHarvested: p.h,
    currentStreak: p.c,
    longestStreak: p.l,
    rarityProgress: {
      common: { unlocked: p.rc, total: SPECIES_BY_RARITY.common.length },
      rare: { unlocked: p.rr, total: SPECIES_BY_RARITY.rare.length },
      legendary: { unlocked: p.rl, total: SPECIES_BY_RARITY.legendary.length },
    },
    startedAt: p.t,
    serial: p.s,
    displayName: p.n,
    sharedAt: p.d,
    title: p.ti ?? p.r,
    avatar: validateAvatar(p.av),
  };
}

function validateAvatar(av: unknown): FloristCardData['avatar'] {
  if (!av || typeof av !== 'object') return null;
  const o = av as Record<string, unknown>;
  const i =
    typeof o.i === 'number' && Number.isFinite(o.i) && o.i >= 0
      ? (o.i as number)
      : null;
  const g = o.g === 1 || o.g === 2 || o.g === 3 ? o.g : null;
  if (i === null || g === null) return null;
  // Species may have been removed from the catalog since the link was
  // written — degrade gracefully to a placeholder rather than linking
  // to a broken webp.
  if (!SPECIES_BY_ID[i]) return null;
  return { speciesId: i, stage: g };
}

function validatePacked(v: unknown): PackedPayload | null {
  if (typeof v !== 'object' || v === null) return null;
  const o = v as Record<string, unknown>;

  // Numeric fields — clamp to finite, non-negative integers. Rejects
  // NaN, Infinity, negative tampering, and non-number types in one go.
  const num = (k: string): number | null => {
    const x = o[k];
    return typeof x === 'number' && Number.isFinite(x) && x >= 0 ? x : null;
  };
  const str = (k: string, maxLen: number): string | null => {
    const x = o[k];
    return typeof x === 'string' && x.length > 0 && x.length <= maxLen ? x : null;
  };

  const v_ = num('v');
  const s = str('s', 32);
  const n = str('n', 64);
  const r = o.r;
  const u = num('u');
  const h = num('h');
  const c = num('c');
  const l = num('l');
  const rc = num('rc');
  const rr = num('rr');
  const rl = num('rl');
  const t = num('t');

  if (
    v_ === null ||
    s === null ||
    n === null ||
    typeof r !== 'string' ||
    !VALID_RANKS.includes(r as FloristRank) ||
    u === null ||
    h === null ||
    c === null ||
    l === null ||
    rc === null ||
    rr === null ||
    rl === null ||
    t === null
  ) {
    return null;
  }

  // Optional: title text (≤64 chars). Deeper validation (rank fallback)
  // happens in unpack via the `?? p.r` fallback.
  const ti =
    typeof o.ti === 'string' && o.ti.length > 0 && o.ti.length <= 64
      ? o.ti
      : undefined;
  // Optional: avatar object. Structural validation happens in
  // validateAvatar — here we just pass through any object-shaped value.
  const av =
    typeof o.av === 'object' && o.av !== null
      ? (o.av as PackedPayload['av'])
      : undefined;
  // Optional: sharedAt.
  const d = typeof o.d === 'number' && Number.isFinite(o.d) ? o.d : undefined;

  return {
    v: v_,
    s,
    n,
    r: r as FloristRank,
    u,
    h,
    c,
    l,
    rc,
    rr,
    rl,
    t,
    ...(d !== undefined ? { d } : {}),
    ...(ti !== undefined ? { ti } : {}),
    ...(av !== undefined ? { av } : {}),
  };
}

// ── base64url <-> bytes (URL-safe, no padding) ───────────────────────
//
// Standard base64 uses `+` / `/` / `=`, all of which are either
// reserved or ugly inside a URL fragment. base64url swaps `+`→`-`,
// `/`→`_`, and strips trailing `=` padding. We roundtrip through
// btoa/atob since the CompressionStream output is a tight byte array.

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(b64url: string): Uint8Array {
  // Reject anything that isn't in the URL-safe alphabet before handing
  // it to atob — atob throws on `=` in the middle but silently ignores
  // some other garbage.
  if (!/^[A-Za-z0-9\-_]*$/.test(b64url)) {
    throw new Error('invalid base64url');
  }
  const padLen = (4 - (b64url.length % 4)) % 4;
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padLen);
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
