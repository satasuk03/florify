"use client";

import type { FloristCardData } from "@/store/gameStore";
import { SPECIES } from "@/data/species";
import { renderPassportImage } from "./renderPassportImage";

const TOTAL_SPECIES = SPECIES.length;

/**
 * Share pipeline with graceful fallbacks. Matches designs/11 §11.6.
 *
 * Happy path (iOS Safari 16.4+, Android Chrome 96+, Edge mobile):
 *   render → `navigator.share({ files })` → OS share sheet → user picks
 *   IG Stories / FB Stories / Line / Messages.
 *
 * Fallback path (desktop, old iOS, in-app webviews):
 *   render → `<a download>` click → PNG lands in Downloads; we show a
 *   toast telling the user how to open Instagram and pick it from the
 *   camera roll.
 *
 * User-cancel is a distinct outcome — don't treat it as an error.
 */

export type ShareResult =
  | { kind: "shared" }
  | { kind: "downloaded"; url: string; filename: string }
  | { kind: "cancelled" }
  | { kind: "error"; message: string };

export async function sharePassport(
  data: FloristCardData,
): Promise<ShareResult> {
  try {
    const blob = await renderPassportImage(data);
    const filename = `florify-passport-${data.serial}.png`;
    const file = new File([blob], filename, { type: "image/png" });

    if (canShareFiles(file)) {
      try {
        await navigator.share({
          files: [file],
          title: "My Florify Passport",
          text: `${data.speciesUnlocked}/${TOTAL_SPECIES} species unlocked 🌳 florify.zeze.app`,
        });
        return { kind: "shared" };
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return { kind: "cancelled" };
        }
        // If the native share fails for any other reason, fall through
        // to the download path rather than failing the whole flow.
      }
    }

    // Download fallback
    const url = URL.createObjectURL(blob);
    triggerDownload(url, filename);
    // Revoke later so the synthetic click completes first
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    return { kind: "downloaded", url, filename };
  } catch (err) {
    return {
      kind: "error",
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

function canShareFiles(file: File): boolean {
  if (typeof navigator === "undefined") return false;
  if (typeof navigator.canShare !== "function") return false;
  if (typeof navigator.share !== "function") return false;
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

function triggerDownload(url: string, filename: string): void {
  if (typeof document === "undefined") return;
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
