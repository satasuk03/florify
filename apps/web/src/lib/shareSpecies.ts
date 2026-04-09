'use client';

import { copyText } from './clipboard';

/**
 * Share a species via a public Floripedia URL.
 *
 * Happy path (iOS Safari, Android Chrome, Edge mobile):
 *   build `/floripedia/?id=N` → `navigator.share({ url, title, text })`
 *   → OS share sheet → user picks LINE / Messages / IG / etc.
 *
 * Fallback path (desktop, in-app webviews, unsupported browsers):
 *   `copyText(url)` → caller shows a toast.
 *
 * User-cancel (`AbortError`) is a distinct outcome — not an error.
 *
 * Mirrors the shape of `components/florist-card/sharePassport.ts` so the
 * two share surfaces feel consistent.
 */

export type ShareResult =
  | { kind: 'shared' }
  | { kind: 'copied'; url: string }
  | { kind: 'cancelled' }
  | { kind: 'error'; message: string };

interface ShareCopy {
  title: string;
  text: string;
}

/** Optional harvest context embedded in the share URL. */
export interface HarvestInfo {
  /** Display name of the player who harvested. */
  harvester: string;
  /** Epoch-ms timestamp of the harvest. */
  harvestedAt: number;
}

export async function shareSpecies(
  speciesId: number,
  copy: ShareCopy,
  harvest?: HarvestInfo,
): Promise<ShareResult> {
  try {
    const url = buildSpeciesUrl(speciesId, harvest);

    // Always copy the link to clipboard
    await copyText(url);

    if (canShareUrl()) {
      try {
        await navigator.share({ url, title: copy.title, text: copy.text });
        return { kind: 'shared' };
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return { kind: 'cancelled' };
        }
        // Any other share failure → fall through to clipboard result.
      }
    }

    const copied = await copyText(url);
    if (copied) return { kind: 'copied', url };
    return { kind: 'error', message: 'Clipboard unavailable' };
  } catch (err) {
    return { kind: 'error', message: err instanceof Error ? err.message : String(err) };
  }
}

function buildSpeciesUrl(speciesId: number, harvest?: HarvestInfo): string {
  // `trailingSlash: true` in next.config.ts → the route is /floripedia/
  // not /floripedia. Keep the slash before the query string so the URL
  // matches the emitted static file exactly.
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  let url = `${origin}/floripedia/?id=${speciesId}`;

  if (harvest) {
    // Base64-encode harvester name and timestamp so the URL stays clean
    // and non-ASCII names (Thai, etc.) don't bloat the link.
    const by = btoa(encodeURIComponent(harvest.harvester));
    const at = btoa(String(harvest.harvestedAt));
    url += `&by=${by}&at=${at}`;
  }

  return url;
}

function canShareUrl(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (typeof navigator.share !== 'function') return false;
  // `navigator.canShare` is optional on some platforms — absence means
  // URL sharing is supported (spec: URL is always valid data).
  if (typeof navigator.canShare !== 'function') return true;
  try {
    return navigator.canShare({ url: 'https://example.com' });
  } catch {
    return false;
  }
}
