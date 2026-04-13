"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS_BY_ID } from "@/data/achievements";
import { useGameStore } from "@/store/gameStore";
import { useLanguage } from "@/i18n/useT";
import { badgeForAchievement } from "./achievementBadge";

interface Props {
  achievementId: string;
  onClose: () => void;
}

const EXIT_DURATION_MS = 260;

/**
 * Small bottom sheet showing achievement detail when tapping a passport badge.
 * Displays the badge large, achievement name, description, flavor text, and
 * the date it was unlocked.
 */
export function BadgeDetailSheet({ achievementId, onClose }: Props) {
  const state = useGameStore((s) => s.state);
  const lang = useLanguage();
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const beginClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      onClose();
    }, EXIT_DURATION_MS);
  }, [closing, onClose]);

  useEffect(
    () => () => {
      if (closeTimer.current != null) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") beginClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [beginClose]);

  const def = ACHIEVEMENTS_BY_ID.get(achievementId);
  if (!def) return null;

  const badge = badgeForAchievement(def);
  const progress = state.achievements[achievementId];
  const unlockedDate = progress?.unlockedAt
    ? new Date(progress.unlockedAt).toLocaleDateString(
        lang === "th" ? "th-TH" : "en-GB",
        { day: "numeric", month: "short", year: "numeric" },
      )
    : null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center ${
        closing ? "animate-overlay-out" : "animate-overlay-in"
      }`}
      onClick={beginClose}
      role="dialog"
      aria-modal="true"
      aria-label={def.name}
    >
      <div
        className={`w-full sm:max-w-sm bg-cream-50 rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg ${
          closing ? "animate-sheet-down" : "animate-sheet-up"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          {/* Large badge */}
          <div className="relative w-20 h-20 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/badges/shield-1/${badge.shield}.svg`}
              alt=""
              className="w-full h-full"
            />
            <span className="absolute inset-0 flex items-center justify-center text-3xl">
              {badge.emoji}
            </span>
          </div>

          {/* Achievement name */}
          <h3 className="text-lg font-serif font-semibold text-ink-900 mb-1">
            {def.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-ink-600 mb-2">
            {def.description[lang]}
          </p>

          {/* Flavor text */}
          {def.flavor && (
            <p className="text-xs text-ink-400 italic mb-3">
              &ldquo;{def.flavor[lang]}&rdquo;
            </p>
          )}

          {/* Unlock date */}
          {unlockedDate && (
            <p className="text-xs text-ink-400">
              {lang === "th" ? "ปลดล็อคเมื่อ" : "Unlocked"} {unlockedDate}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={beginClose}
          className="w-full mt-5 py-2.5 rounded-xl bg-cream-200 text-ink-700 text-sm font-medium hover:bg-cream-300 transition-colors"
        >
          {lang === "th" ? "ปิด" : "Close"}
        </button>
      </div>
    </div>
  );
}
