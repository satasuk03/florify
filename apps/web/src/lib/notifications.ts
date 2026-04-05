'use client';

import { loadSettings } from '@/store/settingsStore';

/**
 * In-tab browser notifications — designs/08 §8.4.
 *
 * We're not a PWA, so we can't do Web Push. The compromise: schedule a
 * `setTimeout` that fires `new Notification(...)` when the watering
 * cooldown elapses, **but only while the tab is still open**. If the
 * user closes the tab we lose the timer — acceptable tradeoff for
 * keeping the app a static site.
 *
 * Re-arming on `visibilitychange` (StoreHydrator) handles the case
 * where the browser throttles long `setTimeout` when the tab is
 * backgrounded — we recompute the remaining delta when the tab
 * returns to the foreground.
 */

let timerId: ReturnType<typeof setTimeout> | null = null;

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  try {
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch {
    return false;
  }
}

export function canNotify(): boolean {
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;
  if (!loadSettings().notifications) return false;
  return true;
}

/**
 * Schedule a one-shot notification for when watering unlocks again.
 * Cancels any prior scheduled notification — there's only ever one
 * pending cooldown at a time.
 */
export function scheduleCooldownNotification(whenMs: number): void {
  cancelCooldownNotification();
  if (typeof window === 'undefined') return;
  if (!canNotify()) return;

  const delta = whenMs - Date.now();
  if (delta <= 0) {
    // Already elapsed — fire immediately on next tick
    queueMicrotask(() => fireNotification());
    return;
  }

  timerId = setTimeout(() => {
    timerId = null;
    fireNotification();
  }, delta);
}

export function cancelCooldownNotification(): void {
  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
  }
}

function fireNotification(): void {
  if (!canNotify()) return;
  try {
    new Notification('ต้นไม้พร้อมรดน้ำแล้ว 💧', {
      body: 'แวะมารดน้ำเพื่อสะสม progress',
      tag: 'florify-water-ready',
      silent: false,
    });
  } catch (err) {
    console.error('[notifications] fire failed', err);
  }
}
