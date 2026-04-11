"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { selectFloristCard, useGameStore } from "@/store/gameStore";
import { toast } from "@/lib/toast";
import { encodePassportLink } from "@/lib/passportLink";
import { copyText } from "@/lib/clipboard";
import { PassportCard } from "./PassportCard";
import { AchievementsTab } from "./AchievementsTab";
import { sharePassport, type ShareResult } from "./sharePassport";
import { TitleChangeModal } from "./TitleChangeModal";
import { gameEventBus } from "@/lib/gameEventBus";

/**
 * Florist Card modal — passport preview + share action.
 *
 * State machine (designs/11 §11.6):
 *   viewing → generating → {shared, downloaded, cancelled, error} → viewing
 *
 * The preview inside the modal and the PNG that gets shared are rendered
 * from the same layout spec, so they're pixel-identical by construction.
 */

type SheetState =
  | { phase: "viewing" }
  | { phase: "generating" }
  | { phase: "shared" }
  | { phase: "downloaded"; filename: string }
  | { phase: "error"; message: string };

interface Props {
  open: boolean;
  onClose: () => void;
}

export function FloristCardSheet({ open, onClose }: Props) {
  // Subscribe to the stable raw `state` reference and derive the card
  // data with useMemo — NEVER put selectFloristCard inline in a Zustand
  // selector. The selector would rebuild a fresh object every call,
  // which breaks useSyncExternalStore's server-snapshot caching and
  // triggers an infinite render loop. See selectFloristCard docstring.
  const router = useRouter();
  const state = useGameStore((s) => s.state);
  const data = useMemo(() => selectFloristCard(state), [state]);

  const handleEditAvatar = useCallback(() => {
    onClose();
    router.push("/gallery/");
  }, [onClose, router]);
  const [sheet, setSheet] = useState<SheetState>({ phase: "viewing" });
  const [activeTab, setActiveTab] = useState<"passport" | "achievements">(
    "passport",
  );
  const [titleModalOpen, setTitleModalOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(320);

  const unclaimedCount = useMemo(
    () => Object.values(state.achievements).filter((a) => !a.claimedAt).length,
    [state.achievements],
  );

  // Reset the sheet to `viewing` whenever the modal transitions from
  // closed → open. Done as a render-time `prevOpen` check rather than
  // in an effect, since the reset is derived purely from a prop change
  // (see React docs: "Adjusting some state when a prop changes").
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setSheet({ phase: "viewing" });
      setActiveTab("passport");
      setTitleModalOpen(false);
    }
  }

  // Auto-clear success states back to viewing after 3s
  useEffect(() => {
    if (sheet.phase === "shared" || sheet.phase === "downloaded") {
      const id = setTimeout(() => setSheet({ phase: "viewing" }), 3000);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [sheet.phase]);

  // Dismiss on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Measure card-container width so we can pass a concrete pixel size
  // to PassportCard (which uses an absolute-positioned 1080-wide stage
  // scaled by transform).
  useEffect(() => {
    if (!open) return;
    const el = contentRef.current;
    if (!el) return;
    const update = () => {
      // ~80% of content width, capped for desktop readability
      const w = Math.min(Math.max(el.clientWidth - 48, 240), 360);
      setCardWidth(w);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  const handleCopyLink = useCallback(async () => {
    try {
      const copied = await copyText(encodePassportLink(data));
      if (copied) {
        toast("คัดลอกลิงค์พาสปอร์ตแล้ว 🔗");
        gameEventBus.emit({ type: "share" });
      } else {
        toast("เบราว์เซอร์นี้ไม่รองรับการคัดลอก");
      }
    } catch {
      toast("คัดลอกลิงค์ไม่ได้ ลองอีกครั้งนะ");
    }
  }, [data]);

  const handleShare = useCallback(async () => {
    setSheet({ phase: "generating" });
    const result: ShareResult = await sharePassport(data);
    switch (result.kind) {
      case "shared":
        setSheet({ phase: "shared" });
        gameEventBus.emit({ type: "share" });
        return;
      case "downloaded":
        setSheet({ phase: "downloaded", filename: result.filename });
        gameEventBus.emit({ type: "share" });
        toast("บันทึกรูปแล้ว — เปิด Instagram แล้วเลือกจากคลังได้เลย");
        return;
      case "cancelled":
        setSheet({ phase: "viewing" });
        return;
      case "error":
        setSheet({ phase: "error", message: result.message });
        return;
    }
  }, [data]);

  if (!open) return null;

  const shareLabel = (() => {
    switch (sheet.phase) {
      case "generating":
        return "กำลังสร้างรูป…";
      case "shared":
        return "แชร์อีกครั้ง";
      case "downloaded":
        return "บันทึกอีกครั้ง";
      case "error":
        return "ลองอีกครั้ง";
      default:
        return "แชร์";
    }
  })();

  const hint = (() => {
    switch (sheet.phase) {
      case "shared":
        return "✅ แชร์แล้ว";
      case "downloaded":
        return "💾 บันทึกแล้ว — เปิด Instagram → Stories → คลังรูป";
      case "error":
        return `⚠️ ${sheet.message}`;
      default:
        return null;
    }
  })();

  return (
    <div
      className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-overlay-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Florist Card"
    >
      <div
        ref={contentRef}
        className="w-full sm:max-w-md bg-cream-50 rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg max-h-[92dvh] overflow-y-auto scrollbar-elegant animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-cream-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("passport")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "passport"
                  ? "bg-white text-ink-900 shadow-sm"
                  : "text-ink-500 hover:text-ink-700"
              }`}
            >
              📘 Passport
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors relative ${
                activeTab === "achievements"
                  ? "bg-white text-ink-900 shadow-sm"
                  : "text-ink-500 hover:text-ink-700"
              }`}
            >
              🏆 Achievements
              {unclaimedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {unclaimedCount}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-ink-500 text-2xl leading-none w-10 h-10 flex items-center justify-center hover:bg-cream-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {activeTab === "passport" ? (
          <>
            <div className="flex justify-center mb-5">
              <PassportCard
                data={data}
                maxWidth={cardWidth}
                editable
                onEditTitle={() => setTitleModalOpen(true)}
                onEditAvatar={handleEditAvatar}
              />
            </div>

            <div className="flex flex-col gap-2 items-center">
              <div className="flex gap-3 w-full">
                <Button
                  size="md"
                  className="flex-1"
                  onClick={handleShare}
                  disabled={sheet.phase === "generating"}
                  aria-label="Share Florist Card to Instagram or Facebook story"
                >
                  {shareLabel} 🌼
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleCopyLink}
                  aria-label="Copy a shareable link to this passport"
                >
                  คัดลอกลิงค์ 🔗
                </Button>
              </div>
              {hint && (
                <div className="text-xs text-ink-500 mt-1 text-center">
                  {hint}
                </div>
              )}
            </div>
          </>
        ) : (
          <AchievementsTab scrollRef={contentRef} />
        )}
      </div>
      {titleModalOpen && (
        <TitleChangeModal
          onClose={() => setTitleModalOpen(false)}
          currentRank={data.rank}
        />
      )}
    </div>
  );
}
