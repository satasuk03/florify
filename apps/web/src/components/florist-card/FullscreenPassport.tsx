"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import type { FloristCardData } from "@/store/gameStore";
import { PassportCard } from "./PassportCard";
import { PASSPORT_H, PASSPORT_W } from "./passportLayout";

/**
 * Full-viewport overlay that shows the passport at the largest size
 * the viewport can fit while preserving the 9:16 aspect ratio.
 *
 * Dismisses on tap anywhere, on the close affordance, or on Escape.
 * A 12px gutter keeps the card off the viewport edges so rounded
 * corners stay visible against the backdrop.
 */
interface Props {
  data: FloristCardData;
  onClose: () => void;
}

const VIEWPORT_GUTTER = 12;
const ASPECT = PASSPORT_W / PASSPORT_H;

export function FullscreenPassport({ data, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      // Use visualViewport when available for accurate iOS Safari
      // measurements that account for URL bar / keyboard.
      const vv = window.visualViewport;
      const vw = (vv?.width ?? window.innerWidth) - VIEWPORT_GUTTER * 2;
      const vh = (vv?.height ?? window.innerHeight) - VIEWPORT_GUTTER * 2;
      const byHeight = vh * ASPECT;
      setCardWidth(Math.max(0, Math.min(vw, byHeight)));
    };
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Block background scroll while the fullscreen view is mounted.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Closes the fullscreen view but keeps the parent sheet open by
  // stopping the click from bubbling up to the sheet's backdrop.
  const dismiss = (e: MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Florist Card · fullscreen"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm animate-overlay-in"
      style={{ padding: VIEWPORT_GUTTER }}
    >
      {cardWidth > 0 && (
        <div className="relative pointer-events-none" style={{ width: cardWidth }}>
          <PassportCard data={data} maxWidth={cardWidth} />
        </div>
      )}

      <button
        type="button"
        aria-label="ปิด"
        onClick={dismiss}
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-black/55 text-white text-xl leading-none flex items-center justify-center backdrop-blur-sm hover:bg-black/75 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
