/**
 * Copy text to the clipboard, preserving the user-gesture context even
 * when the text requires async work (compression, encoding, etc.).
 *
 * Safari revokes clipboard permission if any `await` runs between the
 * user click and `clipboard.writeText()`. The fix: pass the async work
 * as a Promise into `ClipboardItem`, which Safari specifically allows —
 * the `clipboard.write()` call itself is synchronous within the gesture.
 *
 * Fallback chain: ClipboardItem → writeText → execCommand → false.
 */

export type CopySource = string | Promise<string>;

export async function copyText(source: CopySource): Promise<boolean> {
  // Async path: use ClipboardItem with a Promise to keep gesture alive.
  if (typeof source !== 'string' && supportsClipboardItem()) {
    try {
      const blob = source.then(
        (text) => new Blob([text], { type: 'text/plain' }),
      );
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/plain': blob }),
      ]);
      return true;
    } catch {
      // Fall through — await the text and try direct write.
    }
  }

  const text = typeof source === 'string' ? source : await source;

  // Try writeText (works when still in gesture context or on desktop).
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to execCommand.
    }
  }

  return execCopy(text);
}

function execCopy(text: string): boolean {
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

function supportsClipboardItem(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof ClipboardItem !== 'undefined' &&
    typeof navigator.clipboard?.write === 'function'
  );
}
