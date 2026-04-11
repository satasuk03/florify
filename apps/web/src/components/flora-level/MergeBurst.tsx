"use client";

/**
 * Juicy one-shot particle burst for the Flora Level Merge button.
 *
 * Mirrors the motion language of HarvestConfetti and ProducerClaimBurst
 * (rising arc → gravity drop via the shared confetti keyframes) but
 * scoped tighter so particles stay near the button instead of filling
 * the whole screen. Self-unmounts after the longest animation finishes.
 *
 * Retriggered via a monotonically-incrementing `playKey` from the
 * parent so React re-mounts the whole burst on every click.
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
const LEAF_DELAY_MAX = 200;
const SPARKLE_DURATION_MS = 900;
const SPARKLE_DELAY_MAX = 300;
const TOTAL_MS = Math.max(
  LEAF_DURATION_MS + LEAF_DELAY_MAX,
  SPARKLE_DURATION_MS + SPARKLE_DELAY_MAX,
);

const EMOJI_POOL = ["✨", "🌱", "✦", "🍃", "✨"] as const;

function buildParticles(): { particles: Particle[]; sparkles: Sparkle[] } {
  const rand = Math.random;
  const range = (min: number, max: number) => min + rand() * (max - min);

  const particles: Particle[] = Array.from({ length: 12 }, () => ({
    dx: range(-120, 120),
    dy: -range(80, 160),
    rot: range(-360, 360),
    delay: Math.floor(rand() * LEAF_DELAY_MAX),
    size: Math.round(range(12, 18)),
    emoji: EMOJI_POOL[Math.floor(rand() * EMOJI_POOL.length)]!,
  }));

  const sparkles: Sparkle[] = Array.from({ length: 8 }, () => ({
    dx: range(-100, 100),
    dy: -range(50, 130),
    delay: Math.floor(rand() * SPARKLE_DELAY_MAX),
  }));

  return { particles, sparkles };
}

export function MergeBurst({ playKey }: Props) {
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
              "radial-gradient(circle, #FDE9B5 0%, #FDE9B500 70%)",
            ["--dx" as string]: `${s.dx}px`,
            ["--dy" as string]: `${s.dy}px`,
            animationDelay: `${s.delay}ms`,
          };
          return (
            <span
              key={`s-${i}`}
              className="animate-confetti-sparkle absolute left-0 top-0 block w-[10px] h-[10px] rounded-full"
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
}
