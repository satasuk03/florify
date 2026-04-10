"use client";

/**
 * Ambient "factory working" particle emitter for the ProducerSheet.
 *
 * Emits a tiny emoji puff (🌱/🌿/✨) from the top of the ring every
 * ~2.5s while the sheet is open AND production is still accumulating.
 * Feels like the factory is quietly alive without being noisy. Self-
 * throttles to avoid stacking dozens of particles on slow devices.
 */

import { useEffect, useState, type CSSProperties } from "react";

interface Particle {
  id: number;
  dx: number;
  dy: number;
  rot: number;
  size: number;
  duration: number;
  emoji: string;
}

const EMOJIS = ["🌱", "💧", "✨", "🌿"] as const;
const EMIT_INTERVAL_MS = 1500;
const INITIAL_DELAY_MS = 450;

let idCounter = 0;

export function FactoryPuffs({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const emit = () => {
      const id = ++idCounter;
      const p: Particle = {
        id,
        dx: (Math.random() - 0.5) * 80,
        dy: -(60 + Math.random() * 40),
        rot: (Math.random() - 0.5) * 120,
        size: 30 + Math.round(Math.random() * 12),
        duration: 2500 + Math.random() * 500,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]!,
      };
      setParticles((list) => [...list, p]);
      // Remove after animation finishes so the array doesn't grow forever.
      window.setTimeout(() => {
        setParticles((list) => list.filter((x) => x.id !== id));
      }, p.duration + 100);
    };

    // First puff shortly after mount so users see it immediately.
    const initial = window.setTimeout(emit, INITIAL_DELAY_MS);
    const interval = window.setInterval(emit, EMIT_INTERVAL_MS);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [active]);

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-visible"
    >
      {/* Origin = dead center of the parent ring container, so puffs
          emit from the % readout and spray outward/upward. */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {particles.map((p) => {
          const style: CSSProperties = {
            fontSize: `${p.size}px`,
            lineHeight: 1,
            ["--dx" as string]: `${p.dx}px`,
            ["--dy" as string]: `${p.dy}px`,
            ["--rot" as string]: `${p.rot}deg`,
            ["--puff-duration" as string]: `${p.duration}ms`,
          };
          return (
            <span
              key={p.id}
              className="animate-factory-puff absolute left-0 top-0 block select-none"
              style={style}
            >
              {p.emoji}
            </span>
          );
        })}
      </div>
    </div>
  );
}
