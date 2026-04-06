import { DROP_REGEN_MS as PROD_DROP_REGEN_MS } from "@florify/shared";

/**
 * Dev-only flag. Enabled by setting `NEXT_PUBLIC_DEBUG_MODE=true` in
 * `.env.local` (see `.env.example`). Next.js inlines `NEXT_PUBLIC_*`
 * at build time, so this is a compile-time constant in the bundle.
 */
export const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";

/**
 * Effective drop regeneration interval. In `DEBUG_MODE` this collapses
 * to 3s so a developer can accumulate drops quickly and test the water
 * flow without waiting 5 minutes per drop. Everywhere in the web app
 * should import `DROP_REGEN_MS` from here instead of from
 * `@florify/shared` directly.
 */
export const DROP_REGEN_MS = DEBUG_MODE ? 1_000 : PROD_DROP_REGEN_MS;
