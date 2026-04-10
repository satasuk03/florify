"use client";

/**
 * Juicy one-shot particle burst for the producer claim button.
 *
 * Sprays a mix of 🌱 and 💧 emojis (the two things being claimed)
 * plus a scatter of ✨ sparkles from the button origin. Particles use
 * the existing `confetti-leaf` / `confetti-sparkle` keyframes so the
 * motion language matches HarvestConfetti — a rising arc that drops
 * under gravity. Self-unmounts after the longest animation finishes.
 *
 * Keyed on a `playKey` from the parent so each claim gets a fresh
 * burst (the parent increments a counter on every click).
 */

import { useEffect, useMemo, useState, type CSSProperties } from "react";

interface Props {
  playKey: number;
}

interface Particle {
  dx: number;
  dy: number;
  rot: number;
  delay: number;
  size: number;
  emoji: string;
}

interface Sparkle {
  dx: number;
  dy: number;
  delay: number;
}

const LEAF_DURATION_MS = 1400;
const LEAF_DELAY_MAX = 240;
const SPARKLE_DURATION_MS = 900;
const SPARKLE_DELAY_MAX = 400;
const TOTAL_MS = Math.max(
  LEAF_DURATION_MS + LEAF_DELAY_MAX,
  SPARKLE_DURATION_MS + SPARKLE_DELAY_MAX,
);

const EMOJI_POOL = ["🌱", "🌱", "💧", "💧", "🌿"] as const;

function buildParticles(): { particles: Particle[]; sparkles: Sparkle[] } {
  const rand = Math.random;
  const range = (min: number, max: number) => min + rand() * (max - min);

  const particles: Particle[] = Array.from({ length: 16 }, () => ({
    dx: range(-160, 160),
    dy: -range(130, 220),
    rot: range(-540, 540),
    delay: Math.floor(rand() * LEAF_DELAY_MAX),
    size: Math.round(range(16, 24)),
    emoji: EMOJI_POOL[Math.floor(rand() * EMOJI_POOL.length)]!,
  }));

  const sparkles: Sparkle[] = Array.from({ length: 10 }, () => ({
    dx: range(-140, 140),
    dy: -range(70, 180),
    delay: Math.floor(rand() * SPARKLE_DELAY_MAX),
  }));

  return { particles, sparkles };
}

export function ProducerClaimBurst({ playKey }: Props) {
  const [alive, setAlive] = useState(true);

  useEffect(() => {
    setAlive(true);
    const id = window.setTimeout(() => setAlive(false), TOTAL_MS + 60);
    return () => window.clearTimeout(id);
  }, [playKey]);

  const { particles, sparkles } = useMemo(() => buildParticles(), [playKey]);

  if (!alive) return null;

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none z-30 overflow-visible"
    >
      {/* Origin anchor — centered on the claim button. Particles spray outward. */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {particles.map((p, i) => {
          const style: CSSProperties = {
            fontSize: `${p.size}px`,
            lineHeight: 1,
            ["--dx" as string]: `${p.dx}px`,
            ["--dy" as string]: `${p.dy}px`,
            ["--rot" as string]: `${p.rot}deg`,
            animationDelay: `${p.delay}ms`,
          };
          return (
            <span
              key={`p-${i}`}
              className="animate-confetti-leaf absolute left-0 top-0 block select-none"
              style={style}
            >
              {p.emoji}
            </span>
          );
        })}

        {sparkles.map((s, i) => {
          const style: CSSProperties = {
            background:
              "radial-gradient(circle, #FBF0D8 0%, #F1D88800 70%)",
            ["--dx" as string]: `${s.dx}px`,
            ["--dy" as string]: `${s.dy}px`,
            animationDelay: `${s.delay}ms`,
          };
          return (
            <span
              key={`s-${i}`}
              className="animate-confetti-sparkle absolute left-0 top-0 block w-[12px] h-[12px] rounded-full"
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
}
