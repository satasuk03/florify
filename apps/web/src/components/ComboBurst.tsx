'use client';

/**
 * Combo counter burst — pops a number + scattering droplet particles
 * above the water button on rapid taps. Intensity scales with the
 * combo count: more particles, bigger number, wilder scatter.
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

const SELF_DESTRUCT_MS = 900;

export function ComboBurst({ combo, tapKey }: Props) {
  const [alive, setAlive] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setAlive(false), SELF_DESTRUCT_MS);
    return () => clearTimeout(id);
  }, []);
  if (!alive || combo < 2) return null;

  const rand = seededRandom(tapKey * 7 + combo);

  // Scale particle count with combo: 3 at combo 2, up to 14 at high combos
  const particleCount = Math.min(3 + Math.floor((combo - 2) * 0.9), 14);

  // 5 tiers: 1-3 / 4-7 / 8-11 / 12-15 / 16+
  const fontSize = combo >= 16 ? 64 : combo >= 12 ? 56 : combo >= 8 ? 48 : combo >= 4 ? 40 : 32;
  const numColor = combo >= 16 ? '#d03020' : combo >= 12 ? '#d84020' : combo >= 8 ? '#e07030' : combo >= 4 ? '#c08050' : '#b09070';

  // Particles scatter wider at higher combos
  const scatter = Math.min(55 + combo * 8, 180);

  return (
    <div
      aria-hidden
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-50 overflow-visible"
      style={{ bottom: '100%', marginBottom: '12px', width: '280px', height: '160px' }}
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

      {/* Scatter particles — tiny water drops flying outward */}
      {Array.from({ length: particleCount }, (_, i) => {
        const angle = rand() * Math.PI * 2;
        const dist = scatter * (0.5 + rand() * 0.5);
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 20; // bias upward
        const size = 8 + rand() * (combo >= 16 ? 16 : combo >= 12 ? 14 : combo >= 8 ? 12 : combo >= 4 ? 9 : 6);
        const delay = rand() * 80;

        return (
          <span
            key={i}
            className="absolute left-1/2 top-0 rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(circle at 35% 35%, rgba(140,200,240,0.8), rgba(80,160,220,0.5))`,
              boxShadow: '0 1px 3px rgba(30,80,120,0.2), inset 0 1px 1px rgba(255,255,255,0.5)',
              ['--cdx' as string]: `${dx}px`,
              ['--cdy' as string]: `${dy}px`,
              animation: `combo-particle-fly 500ms cubic-bezier(.22,.68,.36,1) ${delay}ms both`,
            }}
          />
        );
      })}
    </div>
  );
}
