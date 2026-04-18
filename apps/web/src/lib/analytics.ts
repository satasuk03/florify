import { sendGAEvent } from '@next/third-parties/google';

/**
 * Thin GA4 wrapper. Forwards to `window.dataLayer` via sendGAEvent, which
 * no-ops cleanly when GA isn't loaded (SSR prerender, ad blockers, tests).
 *
 * We deliberately send only the passport serial as `user_id` — no
 * displayName or other user-editable fields — so GA never receives PII.
 */

export function identify(serial: string): void {
  sendGAEvent('set', { user_id: serial });
}

export function trackEvent(
  name: string,
  params?: Record<string, unknown>,
): void {
  sendGAEvent('event', name, params ?? {});
}
