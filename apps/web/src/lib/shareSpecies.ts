'use client';

/**
 * Share a species via a public Floripedia URL.
 *
 * Happy path (iOS Safari, Android Chrome, Edge mobile):
 *   build `/floripedia/?id=N` → `navigator.share({ url, title, text })`
 *   → OS share sheet → user picks LINE / Messages / IG / etc.
 *
 * Fallback path (desktop, in-app webviews, unsupported browsers):
 *   `navigator.clipboard.writeText(url)` → caller shows a toast.
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

export async function shareSpecies(
  speciesId: number,
  copy: ShareCopy,
): Promise<ShareResult> {
  try {
    const url = buildSpeciesUrl(speciesId);

    if (canShareUrl()) {
      try {
        await navigator.share({ url, title: copy.title, text: copy.text });
        return { kind: 'shared' };
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return { kind: 'cancelled' };
        }
        // Any other share failure → fall through to clipboard.
      }
    }

    const copied = await copyToClipboard(url);
    if (copied) return { kind: 'copied', url };
    return { kind: 'error', message: 'Clipboard unavailable' };
  } catch (err) {
    return { kind: 'error', message: err instanceof Error ? err.message : String(err) };
  }
}

function buildSpeciesUrl(speciesId: number): string {
  // `trailingSlash: true` in next.config.ts → the route is /floripedia/
  // not /floripedia. Keep the slash before the query string so the URL
  // matches the emitted static file exactly.
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/floripedia/?id=${speciesId}`;
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

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  // Legacy fallback — execCommand('copy') still works in a few webviews
  // where the async Clipboard API is blocked.
  if (typeof document === 'undefined') return false;
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
