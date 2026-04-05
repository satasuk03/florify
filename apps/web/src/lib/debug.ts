import { COOLDOWN_MS as PROD_COOLDOWN_MS } from '@florify/shared';

/**
 * Dev-only flag. Enabled by setting `NEXT_PUBLIC_DEBUG_MODE=true` in
 * `.env.local` (see `.env.example`). Next.js inlines `NEXT_PUBLIC_*`
 * at build time, so this is a compile-time constant in the bundle.
 */
export const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

/**
 * Effective water cooldown. In `DEBUG_MODE` this collapses to 3s so
 * a developer can water repeatedly and watch the flora cross stages
 * (and the stage-change transition in `FloraImage`) without waiting
 * 30 minutes. Everywhere in the web app should import `COOLDOWN_MS`
 * from here instead of from `@florify/shared` directly.
 */
export const COOLDOWN_MS = DEBUG_MODE ? 3_000 : PROD_COOLDOWN_MS;
