"use client";

import { useEffect, useState } from "react";
import { ProducerIcon } from "@/components/icons";
import { useGameStore } from "@/store/gameStore";
import { useT } from "@/i18n/useT";

/**
 * Round corner button for the idle reward machine.
 *
 * Mirrors the visual shape of other PlotView corner buttons (44x44,
 * cream/glass, soft shadow) so it sits cleanly in the top-left stack.
 * What makes it distinct: the circular interior fills with clay "liquid"
 * from the bottom up as the producer accumulates — one button conveys
 * both identity (icon) and progress (fill level).
 *
 * Both producer tracks progress at the same rate (cap === yield/24h for
 * every level), so a single fill represents both sprouts and waters.
 */
export function ProducerButton({ onClick }: { onClick: () => void }) {
  const t = useT();
  const producerState = useGameStore((s) => s.producerState);
  const lastClaimAt = useGameStore((s) => s.state.producer.lastClaimAt);
  const sproutLevel = useGameStore((s) => s.state.producer.sproutLevel);
  const waterLevel = useGameStore((s) => s.state.producer.waterLevel);

  // SSG-safe: producer ratio depends on Date.now(). Gate behind mount.
  const [mounted, setMounted] = useState(false);
  const [, forceTick] = useState(0);
  useEffect(() => {
    setMounted(true);
  }, []);

  const computed = mounted
    ? producerState()
    : { elapsedRatio: 0, isFull: false };

  useEffect(() => {
    if (!mounted || computed.isFull) return;
    const id = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [mounted, computed.isFull, lastClaimAt, sproutLevel, waterLevel]);

  return (
    <div className="pointer-events-auto relative">
      <button
        type="button"
        onClick={onClick}
        aria-label={t("plot.openProducer")}
        className="relative h-11 w-11 rounded-full bg-cream-50/85 backdrop-blur-sm border border-cream-300 flex items-center justify-center text-ink-700 shadow-soft-sm transition-all duration-300 ease-out hover:bg-cream-100 hover:shadow-soft-md hover:-translate-y-0.5 active:scale-95 active:translate-y-0 overflow-hidden"
      >
        {/* Clay liquid rising from the bottom of the circle */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-[height] duration-500 ease-out pointer-events-none"
          style={{ height: `${computed.elapsedRatio * 100}%` }}
          aria-hidden
        >
          <div
            className={
              "absolute inset-0 " +
              (computed.isFull ? "bg-clay-500" : "bg-clay-400")
            }
          />
          {/* Subtle highlight at the surface of the liquid */}
          <div
            className="absolute top-0 left-0 right-0 h-px bg-clay-200/80"
            aria-hidden
          />
        </div>

        {/* Icon stays centered on top of the fill */}
        <span
          className={
            "relative z-10 transition-colors duration-300 " +
            (computed.elapsedRatio > 0.55 ? "text-cream-50" : "text-ink-700")
          }
          aria-hidden
        >
          <ProducerIcon />
        </span>
      </button>

      {/* Ready-to-claim pulse dot — same pattern as MissionCornerButton */}
      {computed.isFull && (
        <span
          className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-clay-500 ring-2 ring-cream-50 animate-pulse pointer-events-none"
          aria-hidden
        />
      )}
    </div>
  );
}
