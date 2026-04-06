'use client';

/**
 * One-shot particle burst that plays alongside the HarvestOverlay glow.
 *
 * Rarity drives the count, palette, and spread so a legendary harvest
 * feels noticeably louder than a common one. Uses the same pure-CSS
 * keyframe pattern as WaterSplash — no libraries, no canvas.
 *
 * Particles are seeded deterministically from `playKey` (the tree id)
 * so React strict-mode double-mounting lands in the same positions
 * twice and doesn't flicker. The component self-unmounts once the
 * longest timeline finishes.
 *
 */

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from 'react';
import type { Rarity } from '@florify/shared';

interface Props {
  rarity: Rarity;
  playKey: string | number;
}

interface Leaf {
  dx: number;
  dy: number;
  rot: number;
  delay: number;
  size: number;
  color: string;
}

interface Sparkle {
  dx: number;
  dy: number;
  delay: number;
  color: string;
}

interface RarityConfig {
  leafCount: number;
  sparkleCount: number;
  spreadX: number;
  liftMin: number;
  liftMax: number;
  leafPalette: string[];
  sparkleColor: string;
}

const CONFIG: Record<Rarity, RarityConfig> = {
  common: {
    leafCount: 8,
    sparkleCount: 0,
    spreadX: 120,
    liftMin: 120,
    liftMax: 200,
    leafPalette: ['#A8C49A', '#6B8E4E', '#C9D9B8'],
    sparkleColor: '#FBF8F3',
  },
  rare: {
    leafCount: 14,
    sparkleCount: 6,
    spreadX: 160,
    liftMin: 140,
    liftMax: 230,
    leafPalette: ['#A8C49A', '#6B8E4E', '#B8CFD9'],
    sparkleColor: '#B8CFD9',
  },
  legendary: {
    leafCount: 22,
    sparkleCount: 14,
    spreadX: 200,
    liftMin: 160,
    liftMax: 260,
    leafPalette: ['#D4A24C', '#E3C07A', '#A8C49A', '#6B8E4E'],
    sparkleColor: '#F1D888',
  },
};

const LEAF_DURATION_MS = 1400;
const LEAF_DELAY_MAX = 240;
const SPARKLE_DURATION_MS = 900;
const SPARKLE_DELAY_MAX = 400;
const TOTAL_MS = Math.max(
  LEAF_DURATION_MS + LEAF_DELAY_MAX,
  SPARKLE_DURATION_MS + SPARKLE_DELAY_MAX,
);

/** Cheap string-hash → uint32 so `tree.id` (uuid-ish) can seed the RNG. */
function hashKey(key: string | number): number {
  const s = String(key);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — tiny deterministic PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildParticles(rarity: Rarity, playKey: string | number) {
  const cfg = CONFIG[rarity];
  const rand = mulberry32(hashKey(playKey));
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)]!;
  const range = (min: number, max: number) => min + rand() * (max - min);

  const leaves: Leaf[] = Array.from({ length: cfg.leafCount }, () => ({
    dx: range(-cfg.spreadX, cfg.spreadX),
    dy: -range(cfg.liftMin, cfg.liftMax),
    rot: range(-540, 540),
    delay: Math.floor(rand() * LEAF_DELAY_MAX),
    size: Math.round(range(10, 16)),
    color: pick(cfg.leafPalette),
  }));

  const sparkles: Sparkle[] = Array.from({ length: cfg.sparkleCount }, () => ({
    dx: range(-cfg.spreadX * 0.9, cfg.spreadX * 0.9),
    dy: -range(cfg.liftMin * 0.6, cfg.liftMax * 0.9),
    delay: Math.floor(rand() * SPARKLE_DELAY_MAX),
    color: cfg.sparkleColor,
  }));

  return { leaves, sparkles };
}

export function HarvestConfetti({ rarity, playKey }: Props) {
  const [alive, setAlive] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setAlive(false), TOTAL_MS + 60);
    return () => window.clearTimeout(id);
  }, [playKey]);

  const { leaves, sparkles } = useMemo(
    () => buildParticles(rarity, playKey),
    [rarity, playKey],
  );

  if (!alive) return null;

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none z-[55] overflow-visible"
    >
      {/* Origin anchor — sits roughly where the flora image centers inside
          the HarvestOverlay card. Particles spray outward from here. */}
      <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2">
        {leaves.map((l, i) => {
          const style: CSSProperties = {
            width: `${l.size}px`,
            height: `${l.size * 1.4}px`,
            background: l.color,
            borderRadius: '60% 10% 60% 10% / 60% 10% 60% 10%',
            boxShadow:
              'inset 0 1px 1px rgba(255,255,255,0.35), 0 1px 2px rgba(75,55,30,0.12)',
            ['--dx' as string]: `${l.dx}px`,
            ['--dy' as string]: `${l.dy}px`,
            ['--rot' as string]: `${l.rot}deg`,
            animationDelay: `${l.delay}ms`,
          };
          return (
            <span
              key={`leaf-${i}`}
              className="animate-confetti-leaf absolute left-0 top-0 block"
              style={style}
            />
          );
        })}

        {sparkles.map((s, i) => {
          const style: CSSProperties = {
            background: `radial-gradient(circle, ${s.color} 0%, ${s.color}00 70%)`,
            ['--dx' as string]: `${s.dx}px`,
            ['--dy' as string]: `${s.dy}px`,
            animationDelay: `${s.delay}ms`,
          };
          return (
            <span
              key={`spark-${i}`}
              className="animate-confetti-sparkle absolute left-0 top-0 block w-[10px] h-[10px] rounded-full"
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
}
