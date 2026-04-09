'use client';

/**
 * Combo counter burst — pops a number + scattering confetti particles
 * above the water button on rapid taps. Intensity scales with the
 * combo count: more particles, bigger number, wilder scatter.
 *
 * Confetti uses warm orange / yellow / red palette and tumbles as it
 * flies outward, giving a celebratory feel on rapid watering combos.
 *
 * Keyed on `tapKey` by the parent so each tap remounts everything
 * and replays the animations from scratch.
 */

import { useEffect, useState } from 'react';

interface Props {
  combo: number;
  /** Monotonic key — parent increments on each tap to force remount. */
  tapKey: number;
}

const PALETTE = [
  '#E8590C', // deep orange
  '#F76707', // orange
  '#FF922B', // light orange
  '#FCC419', // yellow
  '#FFD43B', // light yellow
  '#E03131', // red
  '#F03E3E', // light red
  '#D9480F', // burnt orange
];

/** Confetti shape variants for visual variety */
const SHAPES = ['rect', 'square', 'circle', 'strip'] as const;
type Shape = (typeof SHAPES)[number];

/** Seeded pseudo-random so particles are stable across strict-mode
 *  double-renders. Uses a simple mulberry32 PRNG. */
function seededRandom(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shapeStyle(shape: Shape, size: number) {
  switch (shape) {
    case 'rect':
      return { width: `${size}px`, height: `${size * 0.55}px`, borderRadius: '2px' };
    case 'square':
      return { width: `${size * 0.7}px`, height: `${size * 0.7}px`, borderRadius: '2px' };
    case 'circle':
      return { width: `${size * 0.65}px`, height: `${size * 0.65}px`, borderRadius: '50%' };
    case 'strip':
      return { width: `${size * 1.1}px`, height: `${size * 0.3}px`, borderRadius: '1px' };
  }
}

const SELF_DESTRUCT_MS = 1100;

export function ComboBurst({ combo, tapKey }: Props) {
  const [alive, setAlive] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setAlive(false), SELF_DESTRUCT_MS);
    return () => clearTimeout(id);
  }, []);
  if (!alive || combo < 2) return null;

  const rand = seededRandom(tapKey * 7 + combo);
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)]!;

  // Scale particle count with combo: 4 at combo 2, up to 18 at high combos
  const particleCount = Math.min(4 + Math.floor((combo - 2) * 1.1), 18);

  // Sparkle count at higher combos
  const sparkleCount = combo >= 6 ? Math.min(Math.floor((combo - 4) * 0.8), 8) : 0;

  // 5 tiers: 1-3 / 4-7 / 8-11 / 12-15 / 16+
  const fontSize = combo >= 16 ? 64 : combo >= 12 ? 56 : combo >= 8 ? 48 : combo >= 4 ? 40 : 32;
  const numColor = combo >= 16 ? '#d03020' : combo >= 12 ? '#d84020' : combo >= 8 ? '#e07030' : combo >= 4 ? '#c08050' : '#b09070';

  // Particles scatter wider at higher combos
  const scatter = Math.min(60 + combo * 9, 200);

  // Random spawn spread — particles start from different spots, not one center
  const spawnSpread = 40;

  return (
    <div
      aria-hidden
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-50 overflow-visible"
      style={{ bottom: '100%', marginBottom: '12px', width: '300px', height: '180px' }}
    >
      {/* Combo number */}
      <span
        key={`num-${tapKey}`}
        className="absolute left-1/2 -translate-x-1/2 font-serif font-bold tabular-nums select-none"
        style={{
          fontSize: `${fontSize}px`,
          color: numColor,
          textShadow: '0 1px 4px rgba(180,100,50,0.3)',
          animation: 'combo-num-pop 550ms cubic-bezier(.22,.68,.36,1.15) both',
        }}
      >
        {combo}x
      </span>

      {/* Confetti particles — warm-colored shapes tumbling outward */}
      {Array.from({ length: particleCount }, (_, i) => {
        const angle = rand() * Math.PI * 2;
        const dist = scatter * (0.45 + rand() * 0.55);
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 30; // bias upward
        const size = 9 + rand() * (combo >= 12 ? 10 : combo >= 6 ? 7 : 5);
        const delay = rand() * 180; // wider stagger
        const color = pick(PALETTE);
        const shape = pick(SHAPES);
        const rot = (rand() - 0.5) * 720;
        // Random spawn offset so particles don't all originate from center
        const ox = (rand() - 0.5) * spawnSpread;
        const oy = (rand() - 0.5) * spawnSpread * 0.6;

        return (
          <span
            key={i}
            className="absolute left-1/2 top-0"
            style={{
              ...shapeStyle(shape, size),
              background: color,
              boxShadow: `0 1px 3px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.3)`,
              ['--cox' as string]: `${ox}px`,
              ['--coy' as string]: `${oy}px`,
              ['--cdx' as string]: `${dx}px`,
              ['--cdy' as string]: `${dy}px`,
              ['--crot' as string]: `${rot}deg`,
              animation: `combo-confetti-fly 750ms cubic-bezier(.2,.7,.3,1) ${delay}ms both`,
            }}
          />
        );
      })}

      {/* Tiny sparkle dots at high combos */}
      {Array.from({ length: sparkleCount }, (_, i) => {
        const angle = rand() * Math.PI * 2;
        const dist = scatter * 0.7 * (0.3 + rand() * 0.7);
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 20;
        const delay = rand() * 200;
        const ox = (rand() - 0.5) * spawnSpread * 0.6;
        const oy = (rand() - 0.5) * spawnSpread * 0.4;

        return (
          <span
            key={`sp-${i}`}
            className="absolute left-1/2 top-0 rounded-full"
            style={{
              width: '5px',
              height: '5px',
              background: 'radial-gradient(circle, #FCC419 0%, #FCC41900 70%)',
              ['--cox' as string]: `${ox}px`,
              ['--coy' as string]: `${oy}px`,
              ['--cdx' as string]: `${dx}px`,
              ['--cdy' as string]: `${dy}px`,
              ['--crot' as string]: '0deg',
              animation: `combo-confetti-fly 600ms ease-out ${delay}ms both`,
            }}
          />
        );
      })}
    </div>
  );
}
