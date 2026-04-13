"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ACHIEVEMENTS } from "@/data/achievements";
import { useGameStore } from "@/store/gameStore";
import { CheckIcon } from "@/components/icons";
import { badgeForAchievement } from "./achievementBadge";
import type { PassportBadges } from "@florify/shared";

interface Props {
  onClose: () => void;
  /** Which slot (0/1/2) is being edited. */
  slotIndex: number;
}

const EXIT_DURATION_MS = 260;

/**
 * Modal for picking which claimed achievement to display in a badge slot
 * on the passport. Shows all claimed achievements with their shield + emoji.
 * Selecting one writes immediately via setPassportBadges, then closes.
 */
export function BadgePickerModal({ onClose, slotIndex }: Props) {
  const state = useGameStore((s) => s.state);
  const setPassportBadges = useGameStore((s) => s.setPassportBadges);
  const currentBadges = state.passportCustomization.badges;

  const [query, setQuery] = useState("");
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

  const claimed = useMemo(
    () => ACHIEVEMENTS.filter((a) => state.achievements[a.id]?.claimedAt),
    [state.achievements],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return claimed;
    return claimed.filter((a) => {
      if (a.name.toLowerCase().includes(q)) return true;
      if (a.description.th.toLowerCase().includes(q)) return true;
      if (a.description.en.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [claimed, query]);

  // IDs already used in other slots (can't pick the same badge twice)
  const usedIds = new Set(
    currentBadges.filter((id, i) => id !== null && i !== slotIndex),
  );

  const handlePick = (achievementId: string | null) => {
    const next: PassportBadges = [...currentBadges];
    next[slotIndex] = achievementId;
    setPassportBadges(next);
    beginClose();
  };

  const currentSlotId = currentBadges[slotIndex];

  return (
    <div
      className={`fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center ${
        closing ? "animate-overlay-out" : "animate-overlay-in"
      }`}
      onClick={beginClose}
      role="dialog"
      aria-modal="true"
      aria-label="เลือกตราสัญลักษณ์"
    >
      <div
        className={`w-full sm:max-w-md bg-cream-50 rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg max-h-[80dvh] flex flex-col ${
          closing ? "animate-sheet-down" : "animate-sheet-up"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-serif text-ink-900">
            เลือกตรา — ช่อง {slotIndex + 1}
          </h2>
          <button
            onClick={beginClose}
            aria-label="Close"
            className="text-ink-500 text-2xl leading-none w-10 h-10 flex items-center justify-center hover:bg-cream-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหา achievement"
          className="w-full px-4 py-2.5 rounded-lg bg-cream-100 border border-cream-200 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-clay-400 mb-3"
          autoFocus
        />

        <div className="flex-1 overflow-y-auto scrollbar-elegant p-1 flex flex-col gap-2">
          {/* Clear slot option */}
          <button
            type="button"
            onClick={() => handlePick(null)}
            className={`text-left px-3.5 py-3 rounded-lg transition-colors flex items-center gap-3 border-2 ${
              currentSlotId === null
                ? "bg-clay-100 text-ink-900 border-clay-400"
                : "bg-cream-50 text-ink-700 hover:bg-cream-100 border-cream-200"
            }`}
          >
            <span className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center text-ink-400 text-lg">
              ✕
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">ว่าง</div>
              <div className="text-xs text-ink-500">ไม่แสดงตราในช่องนี้</div>
            </div>
            {currentSlotId === null && (
              <span className="shrink-0 w-6 h-6 rounded-full bg-clay-500 text-cream-50 flex items-center justify-center">
                <CheckIcon size={14} />
              </span>
            )}
          </button>

          {claimed.length === 0 && (
            <p className="text-xs text-ink-500 mt-3 text-center">
              ยังไม่มี Achievement ที่เคลม — ไปเคลมที่แท็บ 🏆 ก่อนนะ
            </p>
          )}

          {filtered.map((a) => {
            const badge = badgeForAchievement(a);
            const selected = currentSlotId === a.id;
            const used = usedIds.has(a.id);
            return (
              <button
                key={a.id}
                type="button"
                disabled={used}
                onClick={() => handlePick(a.id)}
                className={`text-left px-3.5 py-3 rounded-lg transition-colors flex items-center gap-3 border-2 ${
                  used
                    ? "bg-cream-100/50 border-cream-200/50 text-ink-400 cursor-not-allowed"
                    : selected
                      ? "bg-clay-100 text-ink-900 border-clay-400"
                      : "bg-cream-50 text-ink-700 hover:bg-cream-100 border-cream-200"
                }`}
              >
                <span className="relative w-10 h-10 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/badges/shield-1/${badge.shield}.svg`}
                    alt=""
                    className="w-full h-full"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-base">
                    {badge.emoji}
                  </span>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{a.name}</div>
                  <div className="text-xs text-ink-500 mt-0.5 truncate">
                    {a.description.th}
                  </div>
                </div>
                {selected && !used && (
                  <span className="shrink-0 w-6 h-6 rounded-full bg-clay-500 text-cream-50 flex items-center justify-center">
                    <CheckIcon size={14} />
                  </span>
                )}
                {used && (
                  <span className="text-xs text-ink-400 shrink-0">
                    ใช้แล้ว
                  </span>
                )}
              </button>
            );
          })}

          {claimed.length > 0 && filtered.length === 0 && (
            <p className="text-xs text-ink-500 mt-3 text-center">
              ไม่เจอ achievement ที่ตรงกับคำค้น
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
