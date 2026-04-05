'use client';

import { loadSettings } from '@/store/settingsStore';

/**
 * Haptic feedback via `navigator.vibrate`. Respects the user's haptics
 * setting toggle.
 *
 * Support note (designs/08 §8.3): Android Chrome/Firefox support this
 * 100%, iOS Safari still refuses vibration from the web as of iOS 17.
 * That's OK — it's an enhancement, never a requirement.
 */

export type HapticPattern = 'tap' | 'water' | 'harvest' | 'error';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  tap: 10,
  water: [20, 40, 20],
  harvest: [30, 60, 30, 60, 100],
  error: [50, 30, 50],
};

export function haptic(pattern: HapticPattern): void {
  if (typeof navigator === 'undefined') return;
  if (typeof navigator.vibrate !== 'function') return;
  if (!loadSettings().haptics) return;
  navigator.vibrate(PATTERNS[pattern]);
}
