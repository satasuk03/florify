import type { PlayerState } from '@florify/shared';
import { saveStore } from './saveStore';

let timer: ReturnType<typeof setTimeout> | null = null;

/**
 * Debounced persistence. Coalesces rapid state changes into a single
 * localStorage write so watering/tapping doesn't hammer the disk.
 */
export function scheduleSave(state: PlayerState, delayMs = 500): void {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    saveStore.save(state).catch((err) => console.error('[scheduleSave] save failed', err));
    timer = null;
  }, delayMs);
}

/** Flush any pending save immediately (call this from `beforeunload`). */
export function flushSave(state: PlayerState): void {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  saveStore.save(state).catch((err) => console.error('[flushSave] save failed', err));
}
