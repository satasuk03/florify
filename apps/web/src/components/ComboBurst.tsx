'use client';

/**
 * Combo counter burst — pops a number + scattering confetti particles
 * above the water button on rapid taps. Intensity scales with the
 * combo count: more particles, bigger number, wilder scatter.
 *
 * Confetti uses warm orange / yellow / red palette and tumbles as it
 * flies outward, giving a celebratory feel on rapid watering combos.
 *
 * Layers accumulate: each tap adds a new confetti layer while previous
 * layers keep playing. Each layer self-destructs after its animation
 * finishes. Only the combo number replaces on each tap.
 */

import { useEffect, useRef, useState } from 'react';

interface Props {
  combo: number;
  /** Monotonic key — parent increments on each tap. */
  tapKey: number;
}

interface Layer {
  id: number;
  combo: number;
  seed: number;
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

/** How long a single confetti layer lives before self-destructing. */
const LAYER_TTL_MS = 1100;

// ── Single confetti layer (self-destructs) ─────────────────────

function ConfettiLayer({ combo, seed, onDone }: { combo: number; seed: number; onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, LAYER_TTL_MS);
    return () => clearTimeout(id);
  }, [onDone]);

  const rand = seededRandom(seed);
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)]!;

  const particleCount = Math.min(4 + Math.floor((combo - 2) * 1.1), 18);
  const sparkleCount = combo >= 6 ? Math.min(Math.floor((combo - 4) * 0.8), 8) : 0;
  const scatter = Math.min(60 + combo * 9, 200);
  const spawnSpread = 40;

  return (
    <>
      {Array.from({ length: particleCount }, (_, i) => {
        const angle = rand() * Math.PI * 2;
        const dist = scatter * (0.45 + rand() * 0.55);
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 30;
        const size = 9 + rand() * (combo >= 12 ? 10 : combo >= 6 ? 7 : 5);
        const delay = rand() * 180;
        const color = pick(PALETTE);
        const shape = pick(SHAPES);
        const rot = (rand() - 0.5) * 720;
        const ox = (rand() - 0.5) * spawnSpread;
        const oy = (rand() - 0.5) * spawnSpread * 0.6;

        return (
          <span
            key={i}
            className="absolute left-1/2 top-0"
            style={{
              ...shapeStyle(shape, size),
              background: color,
              boxShadow: '0 1px 3px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.3)',
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
    </>
  );
}

// ── Main component: accumulates layers, only number replaces ───

export function ComboBurst({ combo, tapKey }: Props) {
  const [layers, setLayers] = useState<Layer[]>([]);
  const prevTapKey = useRef(-1);

  // Each new tapKey adds a layer
  useEffect(() => {
    if (tapKey !== prevTapKey.current && combo >= 2) {
      prevTapKey.current = tapKey;
      setLayers((prev) => [...prev, { id: tapKey, combo, seed: tapKey * 7 + combo }]);
    }
  }, [tapKey, combo]);

  const removeLayer = (id: number) =>
    setLayers((prev) => prev.filter((l) => l.id !== id));

  if (combo < 2 && layers.length === 0) return null;

  // Number styling — always shows latest combo
  const fontSize = combo >= 16 ? 64 : combo >= 12 ? 56 : combo >= 8 ? 48 : combo >= 4 ? 40 : 32;
  const numColor = combo >= 16 ? '#d03020' : combo >= 12 ? '#d84020' : combo >= 8 ? '#e07030' : combo >= 4 ? '#c08050' : '#b09070';

  return (
    <div
      aria-hidden
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-50 overflow-visible"
      style={{ bottom: '100%', marginBottom: '12px', width: '300px', height: '180px' }}
    >
      {/* Combo number — replaces each tap */}
      {combo >= 2 && (
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
      )}

      {/* Confetti layers — each tap adds one, each self-destructs */}
      {layers.map((l) => (
        <ConfettiLayer
          key={l.id}
          combo={l.combo}
          seed={l.seed}
          onDone={() => removeLayer(l.id)}
        />
      ))}
    </div>
  );
}
