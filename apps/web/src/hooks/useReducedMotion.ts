'use client';

import { useEffect, useState } from 'react';
import { loadSettings } from '@/store/settingsStore';

/**
 * Resolves "should we animate?" from two sources:
 *   1. OS-level prefers-reduced-motion media query
 *   2. User setting toggle (designs/08 §8.5)
 *
 * SSR-safe: returns `false` on the server, then updates on mount.
 * Also listens for media-query changes in real time.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const read = () => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduced(mq.matches || loadSettings().reducedMotion);
    };
    read();
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', read);
    return () => mq.removeEventListener('change', read);
  }, []);

  return reduced;
}
