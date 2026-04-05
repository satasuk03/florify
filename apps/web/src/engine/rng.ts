/**
 * Seeded RNG for deterministic tree generation.
 *
 * Every random decision in the tree engine must flow through an `Rng`
 * obtained from `mulberry32(seed)`. Given the same seed, the full
 * geometry (segments, leaves, colors, scales) must be byte-identical —
 * this is the contract that makes thumbnail regeneration + cloud sync
 * safe without persisting the geometry itself.
 */

export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const randRange = (rng: Rng, min: number, max: number): number =>
  min + rng() * (max - min);

export const randInt = (rng: Rng, min: number, max: number): number =>
  Math.floor(randRange(rng, min, max + 1));

export function randPick<T>(rng: Rng, arr: readonly T[]): T {
  if (arr.length === 0) throw new Error('randPick: empty array');
  const idx = Math.floor(rng() * arr.length);
  const item = arr[idx];
  // noUncheckedIndexedAccess: idx < arr.length by construction, but TS can't prove it.
  if (item === undefined) throw new Error('randPick: unreachable');
  return item;
}

/** Generate a fresh uint32 seed (non-deterministic — uses Math.random). */
export const randSeed = (): number => (Math.random() * 0xffffffff) >>> 0;
