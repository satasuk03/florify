"use client";

import { MISSION_POINTS_PER, MISSION_MILESTONES } from "@florify/shared";
import { CornerButton } from "@/components/CornerButton";
import { CalendarIcon } from "@/components/icons";
import { useGameStore } from "@/store/gameStore";
import { useT } from "@/i18n/useT";

/**
 * Mission corner button with a notification dot when there are
 * unclaimed completed missions.
 */
export function MissionCornerButton({ onClick }: { onClick: () => void }) {
  const t = useT();
  const missions = useGameStore((s) => s.state.dailyMissions.missions);
  const claimedMilestones = useGameStore(
    (s) => s.state.dailyMissions.claimedMilestones,
  );

  const totalPoints =
    missions.filter((m) => m.completed).length * MISSION_POINTS_PER;
  const hasUnclaimed = MISSION_MILESTONES.some(
    (ms) => totalPoints >= ms && !claimedMilestones.includes(ms),
  );

  return (
    <div className="pointer-events-auto relative">
      <CornerButton
        onClick={onClick}
        label={t("plot.openMissions")}
        size="primary"
      >
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
