"use client";

import { useRef } from "react";
import { FloraImage } from "@/components/FloraImage";
import { useHandheld } from "@/hooks/useHandheld";

/**
 * Flora layer with handheld-camera wobble. Extracted so the `useHandheld`
 * effect mounts with the ref'd div — calling the hook higher up in
 * `PlotView` fires its effect before the gated flora div exists, so
 * `ref.current` is null and the RAF loop never starts.
 */
export function HandheldFlora({
  speciesId,
  progress,
}: {
  speciesId: number;
  progress: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useHandheld(ref);
  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none select-none will-change-transform animate-fade-in"
    >
      <FloraImage
        speciesId={speciesId}
        progress={progress}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
