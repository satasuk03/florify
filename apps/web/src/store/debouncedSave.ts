import type { PlayerState } from '@florify/shared';
import { saveStore } from './saveStore';

let timer: ReturnType<typeof setTimeout> | null = null;
let cloudTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Cloud save debounce delay — much longer than local save because
 * Drive API calls are expensive and rate-limited. 5 seconds coalesces
 * rapid taps (e.g. watering) into a single upload.
 */
const CLOUD_DEBOUNCE_MS = 5_000;

/**
 * Debounced persistence. Coalesces rapid state changes into a single
 * localStorage write so watering/tapping doesn't hammer the disk.
 * Also schedules a debounced cloud save if the user is signed in.
 */
export function scheduleSave(state: PlayerState, delayMs = 500): void {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    saveStore.save(state).catch((err) => console.error('[scheduleSave] save failed', err));
    timer = null;
  }, delayMs);

  // Schedule cloud save with a longer debounce
  scheduleCloudSave(state);
}

/** Flush any pending save immediately (call this from `beforeunload`). */
export function flushSave(state: PlayerState): void {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  saveStore.save(state).catch((err) => console.error('[flushSave] save failed', err));

  // Also flush cloud save
  flushCloudSave(state);
}

// ── Cloud save scheduling ───────────────────────────────────────────────
// Lazy-imported to avoid circular dependency with the store module.
let pendingCloudState: PlayerState | null = null;

function scheduleCloudSave(state: PlayerState): void {
  pendingCloudState = state;
  if (cloudTimer) clearTimeout(cloudTimer);
  cloudTimer = setTimeout(() => {
    cloudTimer = null;
    const s = pendingCloudState;
    pendingCloudState = null;
    if (!s) return;
    // Dynamic import avoids circular deps at module init
    import('./cloudSyncStore').then(({ useCloudSyncStore }) => {
      const { signedIn, syncToCloud } = useCloudSyncStore.getState();
      if (signedIn) {
        syncToCloud(s).catch((err) => console.error('[cloudSave] failed', err));
      }
    }).catch(() => { /* cloudSyncStore not available */ });
  }, CLOUD_DEBOUNCE_MS);
}

function flushCloudSave(state: PlayerState): void {
  if (cloudTimer) {
    clearTimeout(cloudTimer);
    cloudTimer = null;
  }
  pendingCloudState = null;
  // Best-effort flush — beforeunload can't wait for async
  import('./cloudSyncStore').then(({ useCloudSyncStore }) => {
    const { signedIn, syncToCloud } = useCloudSyncStore.getState();
    if (signedIn) {
      syncToCloud(state).catch(() => {});
    }
  }).catch(() => {});
}
