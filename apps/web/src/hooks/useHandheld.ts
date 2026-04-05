'use client';

import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Handheld-camera wobble. Samples a tiny smooth 1D noise function at
 * three different offsets to produce organic, non-periodic drift on
 * translateX / translateY / rotate. Writes `transform` directly to the
 * element via ref — no React state, no re-renders. Gated on
 * `useReducedMotion()`; when reduced motion is on, the element still
 * gets the baseline `scale()` so framing stays consistent.
 *
 * Baseline `scale` > 1 exists on purpose: without it, the wobble would
 * expose the edge of the underlying image. A 1.04 scale gives the
 * translation room to move without revealing background.
 */

// Deterministic hash → [0, 1)
function hash(i: number): number {
  const x = Math.sin(i * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

// Smooth 1D value noise, signed → roughly [-1, 1]
function noise1(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f); // smoothstep
  return (hash(i) * (1 - u) + hash(i + 1) * u) * 2 - 1;
}

interface Options {
  /** Peak translate amplitude in pixels. */
  translate?: number;
  /** Peak rotate amplitude in degrees. */
  rotate?: number;
  /** Baseline scale so wobble never reveals the image edge. */
  scale?: number;
  /** Drift speed. Lower = slower, calmer handhold. */
  speed?: number;
}

export function useHandheld(
  ref: RefObject<HTMLElement | null>,
  { translate = 8, rotate = 0.35, scale = 1.04, speed = 0.22 }: Options = {},
): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.style.transform = `scale(${scale})`;
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = ((now - start) / 1000) * speed;
      const x = noise1(t) * translate;
      const y = noise1(t + 53.1) * translate;
      const r = noise1(t + 91.7) * rotate;
      el.style.transform =
        `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) ` +
        `rotate(${r.toFixed(3)}deg) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref, reduced, translate, rotate, scale, speed]);
}
