'use client';

import { loadSettings } from '@/store/settingsStore';

/**
 * In-tab browser notifications — designs/08 §8.4.
 *
 * We're not a PWA, so we can't do Web Push. The compromise: schedule a
 * `setTimeout` that fires `new Notification(...)` when water drops have
 * regenerated enough to water again, **but only while the tab is still
 * open**. If the user closes the tab we lose the timer — acceptable
 * tradeoff for keeping the app a static site.
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
 * Schedule a one-shot notification for when enough drops have
 * regenerated. Cancels any prior scheduled notification — there's only
 * ever one pending at a time.
 */
export function scheduleDropsNotification(whenMs: number): void {
  cancelDropsNotification();
  if (typeof window === 'undefined') return;
  if (!canNotify()) return;

  const delta = whenMs - Date.now();
  if (delta <= 0) {
    queueMicrotask(() => fireNotification());
    return;
  }

  timerId = setTimeout(() => {
    timerId = null;
    fireNotification();
  }, delta);
}

export function cancelDropsNotification(): void {
  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
  }
}

function fireNotification(): void {
  if (!canNotify()) return;
  try {
    new Notification('หยดน้ำเต็มแล้ว 💧', {
      body: 'แวะมารดน้ำต้นไม้ได้เลย',
      tag: 'florify-drops-ready',
      silent: false,
    });
  } catch (err) {
    console.error('[notifications] fire failed', err);
  }
}
