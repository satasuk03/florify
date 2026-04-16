'use client';

import { useEffect } from 'react';

/**
 * Secret gesture: tap bottom-left corner (60x60px) 5 times within 3 seconds
 * to navigate to /recovery. Uses vanilla DOM events so it works even when
 * React event handlers are broken (the main use case for recovery).
 */
export function RecoveryGesture() {
  useEffect(() => {
    const TAP_COUNT = 5;
    const TIMEOUT_MS = 3000;
    const ZONE_SIZE = 60;

    const taps: number[] = [];

    const handler = (e: MouseEvent | TouchEvent) => {
      // Get position
      let x: number, y: number;
      if ('touches' in e && e.touches.length > 0) {
        x = e.touches[0]!.clientX;
        y = e.touches[0]!.clientY;
      } else if ('clientX' in e) {
        x = e.clientX;
        y = e.clientY;
      } else {
        return;
      }

      // Only count taps in bottom-left corner
      if (x > ZONE_SIZE || y < window.innerHeight - ZONE_SIZE) {
        taps.length = 0;
        return;
      }

      const now = Date.now();
      taps.push(now);

      // Remove old taps outside the timeout window
      while (taps.length > 0 && now - taps[0]! > TIMEOUT_MS) {
        taps.shift();
      }

      if (taps.length >= TAP_COUNT) {
        taps.length = 0;
        window.location.href = '/recovery/';
      }
    };

    // Use capture phase so it fires even if React swallows the event
    document.addEventListener('touchstart', handler, { capture: true });
    document.addEventListener('click', handler, { capture: true });

    return () => {
      document.removeEventListener('touchstart', handler, { capture: true });
      document.removeEventListener('click', handler, { capture: true });
    };
  }, []);

  return null;
}
