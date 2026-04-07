"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_WATER_DROPS, type TreeInstance } from "@florify/shared";
import { FloraImage } from "@/components/FloraImage";
import { PerlinNoise } from "@/components/PerlinNoise";
import { Button } from "@/components/Button";
import { DropsIndicator } from "@/components/DropsIndicator";
import { CornerButton } from "@/components/CornerButton";
import {
  GalleryIcon,
  FloristCardIcon,
  GuideBookIcon,
  SettingsIcon,
  WaterDropIcon,
  SproutIcon,
  CalendarIcon,
} from "@/components/icons";
import { FloristCardSheet } from "@/components/florist-card/FloristCardSheet";
import { GuideBookSheet } from "@/components/guidebook/GuideBookSheet";
import { SettingsSheet } from "@/components/settings/SettingsSheet";
import { DailyMissionSheet } from "@/components/daily-missions/DailyMissionSheet";
import { CheckinModal } from "@/components/daily-missions/CheckinModal";
import { HarvestOverlay } from "@/components/HarvestOverlay";
import { SeedPacket } from "@/components/SeedPacket";
import { WaterSplash } from "@/components/WaterSplash";
import { LanguageToggle } from "@/components/LanguageToggle";
import { WelcomeDialogue } from "@/components/welcome/WelcomeDialogue";
import { useGameStore } from "@/store/gameStore";
import { useHandheld } from "@/hooks/useHandheld";
import { SPECIES } from "@/data/species";
import { useT } from "@/i18n/useT";
import { loadSettings, saveSettings } from "@/store/settingsStore";
import { MISSION_POINTS_PER, MISSION_MILESTONES } from "@florify/shared";
import { todayLocalDate } from "@/lib/time";

/**
 * Home screen — designs/07 §7.1.
 *
 * Full-bleed 2D flora image (three growth stages, driven by progress).
 * Three corner buttons (Gallery TL; Florist Card + Login TR stack).
 * One big toggle button at the bottom that cycles through plant →
 * water → disabled+countdown based on the active tree state. No other
 * chrome — the flora is the hero.
 */
export function PlotView() {
  const t = useT();
  const tree = useGameStore((s) => s.state.activeTree);
  const canWater = useGameStore((s) => s.canWater());
  const drops = useGameStore((s) => s.waterDrops());
  const nextDrop = useGameStore((s) => s.nextDropAt());
  const plant = useGameStore((s) => s.plantTree);
  const water = useGameStore((s) => s.waterTree);
  const [showFlorist, setShowFlorist] = useState(false);
  const [showGuideBook, setShowGuideBook] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const hydrated = useGameStore((s) => s.hydrated);
  const lastRewardDate = useGameStore((s) => s.state.streak.lastRewardDate);
  const displayName = useGameStore((s) => s.state.displayName);
  const setDisplayName = useGameStore((s) => s.setDisplayName);

  // Show welcome dialogue on first ever visit, or check-in modal after hydration.
  const [checkinShown, setCheckinShown] = useState(false);
  useEffect(() => {
    if (!loadSettings().hasSeenWelcome) {
      setShowWelcome(true);
      return;
    }
    if (hydrated && !checkinShown && lastRewardDate !== todayLocalDate()) {
      setCheckinShown(true);
      setShowCheckin(true);
    }
  }, [hydrated, lastRewardDate, checkinShown]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    saveSettings({ ...loadSettings(), hasSeenWelcome: true });
    // Flow into check-in modal for first-time users
    if (hydrated && lastRewardDate !== todayLocalDate()) {
      setCheckinShown(true);
      setShowCheckin(true);
    }
  };
  const [harvested, setHarvested] = useState<TreeInstance | null>(null);
  const [pityPointsGained, setPityPointsGained] = useState(0);
  const [pityReward, setPityReward] = useState<{ speciesId: number; rarity: import('@florify/shared').Rarity } | undefined>();
  // Monotonic counter keyed onto <WaterSplash> — incrementing it on
  // every successful water tap remounts the component and replays its
  // one-shot droplet animation from the start. 0 means "never tapped",
  // which suppresses the initial render.
  const [splashKey, setSplashKey] = useState(0);

  // Plot phase state machine. Drives whether we show the seed packet,
  // the opening animation, or the full flora. `activeTree` is the
  // ground truth from the store but we can't render flora the instant
  // it appears — the packet opening needs ~1.2s first. So the phase is
  // derived on mount, then advanced manually by the packet's onComplete
  // callback, and re-synced in render (via the "adjust state on prop
  // change" pattern) for post-harvest transitions and zustand hydration
  // edge cases.
  type Phase = "empty" | "opening" | "tree";
  const [phase, setPhase] = useState<Phase>(tree ? "tree" : "empty");
  const [prevTree, setPrevTree] = useState(tree);
  if (tree !== prevTree) {
    setPrevTree(tree);
    // Hydration from saved state with an existing tree → skip the
    // animation entirely and show the flora immediately.
    if (tree && phase === "empty") setPhase("tree");
    // Post-harvest (waterTree clears activeTree) → return to empty
    // state with the packet visible again for the next plant. We
    // intentionally don't touch 'opening' — that's a user-driven
    // latch the packet's onComplete will advance.
    else if (!tree && phase === "tree") setPhase("empty");
  }

  // Periodically re-render so the drop count and "next drop" timer
  // stay up to date. `computeDrops` is timestamp-based so this just
  // triggers React to re-read the selectors. Only active during the
  // "tree" phase — running it during "opening" would reset the
  // SeedPacket's onComplete timeout on every tick (the inline callback
  // creates a new ref each render, which SeedPacket's useEffect treats
  // as a dep change).
  const [, forceTick] = useState(0);
  useEffect(() => {
    if (phase !== "tree" || drops >= MAX_WATER_DROPS) return;
    const id = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [phase, drops]);

  const handleWater = () => {
    const result = water();
    if (!result.ok) return;
    setSplashKey((k) => k + 1);
    if (result.harvested) {
      setHarvested(result.harvested);
      setPityPointsGained(result.pityPointsGained ?? 0);
      setPityReward(result.pityReward);
    }
  };

  const handlePlant = () => {
    // Guard against double-taps during the opening animation. The
    // button's `pointer-events-none` also blocks this but belt +
    // braces — a keyboard user can still activate a focused button.
    if (phase !== "empty") return;
    setPhase("opening");
    plant();
  };

  const percent = tree
    ? Math.round((tree.currentWaterings / tree.requiredWaterings) * 100)
    : 0;
  const species = tree ? SPECIES[tree.speciesId] : null;

  return (
    <main className="relative h-full w-full bg-cream-50 overflow-hidden">
      {/* Fine-grain perlin texture behind everything */}
      <PerlinNoise />

      {/* Full-bleed 2D flora (fills the frame on desktop, the screen on mobile).
          Wrapped in a ref'd box that receives a handheld-camera wobble via
          `useHandheld`, so the flora drifts gently like a shaky phone hold.
          Gated on `phase === 'tree'` rather than `tree` directly so the
          seed packet has time to finish its opening sequence before the
          flora mounts and plays its stage-in animation. */}
      {tree && phase === "tree" && (
        <HandheldFlora
          speciesId={tree.speciesId}
          progress={tree.currentWaterings / tree.requiredWaterings}
        />
      )}

      {/* Water droplet burst — remounts on every successful water tap
          via the `splashKey` counter so the keyframes replay cleanly. */}
      {phase === "tree" && splashKey > 0 && <WaterSplash key={splashKey} />}

      {/* ─── SEED PACKET ───────────────────────────────────
          Centerpiece of the empty state; plays its opening sequence
          while the phase is 'opening'. Sized to ~62% of viewport
          width (capped at 280px) so it sits comfortably between the
          corner chrome and the bottom button on phone screens. */}
      {phase !== "tree" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <SeedPacket
            state={phase === "opening" ? "opening" : "idle"}
            onComplete={() => setPhase("tree")}
            className="w-[min(62vw,280px)]"
          />
        </div>
      )}

      {/* ─── TOP-CENTER: Florify wordmark + active tree readout ─────
          Identifies the app (Fraunces serif, same family as the passport
          wordmark) and — when a tree is active — surfaces its species
          name, a growth gauge, and the waterings tally. Sits between the
          corner buttons; width is capped so it never collides with them. */}
      <div
        className="absolute top-0 left-0 right-0 flex flex-col items-center pointer-events-none animate-fade-down"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 0.9rem)",
          animationDelay: "60ms",
        }}
      >
        <div className="font-serif text-2xl font-bold text-ink-900 tracking-[0.15em]">
          Florify
        </div>
      </div>
      {/* Readout card lives OUTSIDE the animate-fade-down wrapper above.
          That wrapper's keyframes leave `transform: translateY(0)` set via
          `animation-fill-mode: both`, which creates a stacking context and
          isolates any descendant's backdrop — meaning `backdrop-blur` on a
          child div would show no blur because the foliage behind it isn't
          in the backdrop group. Rendering the card as a sibling with an
          opacity-only animation keeps the backdrop transparent to the flora
          layer underneath. */}
      {phase === "tree" && tree && species && (
        <div
          className="absolute left-0 right-0 flex justify-center pointer-events-none"
          style={{
            top: "calc(env(safe-area-inset-top) + 3.9rem)",
          }}
        >
          <div
            key={tree.id}
            className="flex flex-col items-center gap-1.5 animate-fade-in rounded-2xl bg-cream-50/30 backdrop-blur-md border border-cream-200/60 shadow-soft-sm px-5 py-3"
          >
            <div className="flex items-baseline gap-2">
              <div className="font-serif text-sm font-medium text-ink-700">
                {species.name}
              </div>
              <div
                className={`text-[10px] uppercase tracking-[0.15em] font-semibold ${
                  tree.rarity === "legendary"
                    ? "text-amber-600"
                    : tree.rarity === "rare"
                      ? "text-sky-600"
                      : "text-ink-400"
                }`}
              >
                {tree.rarity}
              </div>
            </div>
            <div className="w-32 h-1.5 rounded-full bg-ink-900/10 overflow-hidden">
              <div
                className="h-full bg-ink-900/60 transition-[width] duration-500 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="text-[11px] text-ink-500 tabular-nums tracking-wider">
              {percent}%
            </div>
          </div>
        </div>
      )}

      {/* ─── TOP-LEFT: Gallery + Language toggle ───────── */}
      <div
        className="absolute top-0 left-0 flex flex-col items-start gap-2 pl-4 pointer-events-none animate-fade-down"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)",
          animationDelay: "120ms",
        }}
      >
        {/* id is read by HarvestOverlay to measure the fly-to-gallery
            target rect when the player taps "Collect". */}
        <div id="fly-target-gallery" className="pointer-events-auto">
          <CornerButton to="/gallery" label={t('plot.openGallery')} size="primary">
            <GalleryIcon />
          </CornerButton>
        </div>
        <MissionCornerButton onClick={() => setShowMissions(true)} />
        <LanguageToggle />
      </div>

      {/* ─── TOP-RIGHT: Florist Card + Guide Book + Settings ── */}
      <div
        className="absolute top-0 right-0 flex flex-col items-end gap-2 pr-4 pointer-events-none animate-fade-down"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)",
          animationDelay: "200ms",
        }}
      >
        <CornerButton
          onClick={() => setShowFlorist(true)}
          label={t('plot.openFloristCard')}
          size="primary"
        >
          <FloristCardIcon />
        </CornerButton>

        <CornerButton
          onClick={() => setShowGuideBook(true)}
          label={t('plot.openGuideBook')}
          size="primary"
        >
          <GuideBookIcon />
        </CornerButton>

        <CornerButton
          onClick={() => setShowSettings(true)}
          label={t('plot.openSettings')}
          size="primary"
        >
          <SettingsIcon />
        </CornerButton>
      </div>

      {/* ─── BOTTOM CENTER ACTION ──────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center pointer-events-none animate-fade-up"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)",
          animationDelay: "280ms",
        }}
      >
        <div
          className={`pointer-events-auto flex flex-col items-center transition-opacity duration-[240ms] ease-out ${
            phase === "opening"
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        >
          {/* Water drops indicator — always visible when a tree is active. */}
          {phase === "tree" && tree && (
            <DropsIndicator drops={drops} nextDropAt={nextDrop} />
          )}

          {phase === "empty" ? (
            <ActionButton
              onClick={handlePlant}
              icon={<SproutIcon size={22} />}
              label={t('plot.plant')}
              tone="plant"
            />
          ) : phase === "tree" ? (
            <ActionButton
              onClick={handleWater}
              disabled={!canWater}
              icon={<WaterDropIcon size={22} />}
              label={t('plot.water')}
              tone="water"
            />
          ) : null}
        </div>
      </div>

      <CheckinModal
        open={showCheckin}
        onClose={() => setShowCheckin(false)}
      />
      <DailyMissionSheet
        open={showMissions}
        onClose={() => setShowMissions(false)}
      />
      <FloristCardSheet
        open={showFlorist}
        onClose={() => setShowFlorist(false)}
      />
      <GuideBookSheet
        open={showGuideBook}
        onClose={() => setShowGuideBook(false)}
      />
      <SettingsSheet
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onReplayWelcome={() => {
          setShowSettings(false);
          setShowWelcome(true);
        }}
      />
      <HarvestOverlay
        tree={harvested}
        pityPointsGained={pityPointsGained}
        pityReward={pityReward}
        onDismiss={() => setHarvested(null)}
      />
      {showWelcome && (
        <WelcomeDialogue
          onComplete={handleWelcomeComplete}
          onNameChange={setDisplayName}
          initialName={displayName}
        />
      )}
    </main>
  );
}

/**
 * Bottom-center action button (Plant / Water). A tuned variant of the
 * primary Button: full pill, icon + label pair, warm gradient fill, inner
 * highlight ring, and a soft halo behind it that tints to match the action
 * (clay for "plant", a cooler sky-tinted clay for "water"). Disabled state
 * drops the halo and desaturates — the parent still shows the countdown.
 */
function ActionButton({
  onClick,
  disabled,
  icon,
  label,
  tone,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  tone: "plant" | "water";
}) {
  return (
    <div className="relative">
      {/* Warm clay halo — deeply saturated orange glow behind the glass
          so the tint reads vividly against the cream backdrop. Hidden
          when disabled so the cooldown state looks visibly "asleep". */}
      <div
        aria-hidden
        className={`absolute -inset-5 rounded-full blur-2xl transition-opacity duration-500
          bg-[radial-gradient(ellipse_at_center,rgba(222,145,95,0.55),rgba(199,130,90,0.32)_55%,transparent_82%)]
          ${disabled ? "opacity-0" : "opacity-100 animate-pulse-slow"}`}
      />
      <Button
        size="lg"
        onClick={onClick}
        disabled={disabled}
        className={`relative !rounded-full !h-14 px-10 min-w-[220px]
          !bg-[rgba(216,148,110,0.55)] backdrop-blur-xl backdrop-saturate-150
          text-cream-50
          ring-1 ring-inset ring-white/40
          border border-clay-300/50
          shadow-[0_10px_28px_-10px_rgba(185,100,60,0.5),inset_0_1px_0_0_rgba(255,235,215,0.6),inset_0_-8px_18px_-8px_rgba(170,85,45,0.4)]
          hover:!bg-[rgba(220,152,114,0.65)] hover:shadow-[0_14px_36px_-10px_rgba(185,100,60,0.6),inset_0_1px_0_0_rgba(255,240,220,0.65),inset_0_-8px_18px_-8px_rgba(170,85,45,0.45)]
          before:content-[''] before:absolute before:inset-x-3 before:top-1 before:h-1/2 before:rounded-full
          before:bg-gradient-to-b before:from-white/50 before:to-transparent before:pointer-events-none
          ${disabled ? "saturate-50 opacity-60" : ""}`}
      >
        <span className="relative flex items-center justify-center gap-2.5 drop-shadow-[0_1px_1px_rgba(90,45,20,0.45)]">
          <span className="text-cream-50">{icon}</span>
          <span className="font-serif tracking-wide">{label}</span>
        </span>
      </Button>
    </div>
  );
}

/**
 * Mission corner button with a notification dot when there are
 * unclaimed completed missions.
 */
function MissionCornerButton({ onClick }: { onClick: () => void }) {
  const t = useT();
  const missions = useGameStore((s) => s.state.dailyMissions.missions);
  const claimedMilestones = useGameStore((s) => s.state.dailyMissions.claimedMilestones);

  const totalPoints = missions.filter((m) => m.completed).length * MISSION_POINTS_PER;
  const hasUnclaimed = MISSION_MILESTONES.some(
    (ms) => totalPoints >= ms && !claimedMilestones.includes(ms),
  );

  return (
    <div className="pointer-events-auto relative">
      <CornerButton onClick={onClick} label={t('plot.openMissions')} size="primary">
        <CalendarIcon />
      </CornerButton>
      {hasUnclaimed && (
        <span
          className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-clay-500 ring-2 ring-cream-50 animate-pulse"
          aria-hidden
        />
      )}
    </div>
  );
}

/**
 * Flora layer with handheld-camera wobble. Extracted so the `useHandheld`
 * effect mounts with the ref'd div — calling the hook higher up in
 * `PlotView` fires its effect before the gated flora div exists, so
 * `ref.current` is null and the RAF loop never starts.
 */
function HandheldFlora({
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
