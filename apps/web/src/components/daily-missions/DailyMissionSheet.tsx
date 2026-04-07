'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { CheckIcon, WaterDropIcon } from '@/components/icons';
import { useGameStore } from '@/store/gameStore';
import { useT } from '@/i18n/useT';
import { toast } from '@/lib/toast';
import {
  MISSION_MILESTONES,
  MISSION_MILESTONE_DROPS,
  MISSION_POINTS_PER,
  type DailyMission,
  type MissionType,
} from '@florify/shared';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DailyMissionSheet({ open, onClose }: Props) {
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-overlay-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('missions.title')}
    >
      <div
        className="w-full sm:max-w-md bg-cream-50 rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg max-h-[92dvh] overflow-y-auto scrollbar-elegant animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        <Header onClose={onClose} />
        <MilestoneBar />
        <MissionList />
        <ClaimButton />
      </div>
    </div>
  );
}

// ── Header ──────────────────────────────────────────────────────────

function Header({ onClose }: { onClose: () => void }) {
  const t = useT();
  return (
    <div className="flex justify-between items-center mb-5">
      <div>
        <h2 className="font-serif text-2xl text-ink-900">{t('missions.title')}</h2>
        <div className="text-xs text-ink-500 mt-0.5">
          {t('missions.resetIn', { time: '' })}
          <MidnightCountdown />
        </div>
      </div>
      <button
        onClick={onClose}
        aria-label={t('missions.close')}
        className="text-ink-500 text-2xl leading-none w-10 h-10 flex items-center justify-center hover:bg-cream-100 rounded-full transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

function MidnightCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const ms = Math.max(0, midnight.getTime() - now);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);

  return (
    <span className="tabular-nums font-mono">
      {h}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
    </span>
  );
}

// ── Milestone Progress Bar ──────────────────────────────────────────

function MilestoneBar() {
  const missions = useGameStore((s) => s.state.dailyMissions.missions);
  const claimedMilestones = useGameStore((s) => s.state.dailyMissions.claimedMilestones);
  const totalPoints = missions.filter((m) => m.completed).length * MISSION_POINTS_PER;
  const maxPoints = MISSION_MILESTONES[MISSION_MILESTONES.length - 1]!;
  const fillPct = Math.min(100, (totalPoints / maxPoints) * 100);

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
        <span className="font-medium">{totalPoints}P</span>
        <span>{maxPoints}P</span>
      </div>
      <div className="relative h-2.5 bg-cream-200 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-leaf-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${fillPct}%` }}
        />
      </div>
      <div className="flex justify-between">
        {MISSION_MILESTONES.map((milestone, i) => {
          const drops = MISSION_MILESTONE_DROPS[i]!;
          const reached = totalPoints >= milestone;
          const claimed = claimedMilestones.includes(milestone);
          return (
            <div key={milestone} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border transition-all duration-300 ${
                  claimed
                    ? 'bg-leaf-500 border-leaf-600 text-cream-50'
                    : reached
                      ? 'bg-leaf-100 border-leaf-400 text-leaf-700 animate-pulse'
                      : 'bg-cream-100 border-cream-300 text-ink-400'
                }`}
              >
                {claimed ? <CheckIcon size={14} /> : `${drops}`}
              </div>
              <span className={`text-[10px] tabular-nums ${reached ? 'text-leaf-600 font-medium' : 'text-ink-400'}`}>
                {milestone}P
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Mission List ────────────────────────────────────────────────────

function missionLabel(t: ReturnType<typeof useT>, mission: DailyMission): string {
  const key = `missions.${mission.type}` as Parameters<typeof t>[0];
  return t(key, { target: mission.target });
}

function MissionList() {
  const t = useT();
  const missions = useGameStore((s) => s.state.dailyMissions.missions);

  if (missions.length === 0) return null;

  return (
    <div className="space-y-2.5 mb-5">
      {missions.map((mission) => (
        <MissionCard key={mission.templateId} mission={mission} label={missionLabel(t, mission)} />
      ))}
    </div>
  );
}

function MissionCard({ mission, label }: { mission: DailyMission; label: string }) {
  const progressPct = Math.min(100, (mission.progress / mission.target) * 100);

  return (
    <Card className="p-3.5 flex items-center gap-3">
      {/* Points badge */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-clay-500/15 border border-clay-400/30 flex items-center justify-center">
        <span className="text-xs font-bold text-clay-600">{MISSION_POINTS_PER}P</span>
      </div>

      {/* Description + progress */}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-ink-800 font-medium truncate">{label}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-cream-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                mission.completed ? 'bg-leaf-500' : 'bg-clay-400'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[11px] text-ink-500 tabular-nums font-mono flex-shrink-0">
            {mission.progress}/{mission.target}
          </span>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex-shrink-0">
        {mission.completed ? (
          <div className="w-7 h-7 rounded-full bg-leaf-500 flex items-center justify-center">
            <CheckIcon size={14} className="text-cream-50" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full border-2 border-cream-300" />
        )}
      </div>
    </Card>
  );
}

// ── Claim Button ────────────────────────────────────────────────────

function ClaimButton() {
  const t = useT();
  const missions = useGameStore((s) => s.state.dailyMissions.missions);
  const claimedMilestones = useGameStore((s) => s.state.dailyMissions.claimedMilestones);
  const claimMissions = useGameStore((s) => s.claimMissions);

  const totalPoints = missions.filter((m) => m.completed).length * MISSION_POINTS_PER;

  // Calculate unclaimed drops available
  let unclaimedDrops = 0;
  for (let i = 0; i < MISSION_MILESTONES.length; i++) {
    const milestone = MISSION_MILESTONES[i]!;
    const drops = MISSION_MILESTONE_DROPS[i]!;
    if (totalPoints >= milestone && !claimedMilestones.includes(milestone)) {
      unclaimedDrops += drops;
    }
  }

  const canClaim = unclaimedDrops > 0;
  const allClaimed = claimedMilestones.length === MISSION_MILESTONES.length;

  const handleClaim = () => {
    const { dropsAwarded } = claimMissions();
    if (dropsAwarded > 0) {
      toast(t('missions.dropsAwarded', { drops: dropsAwarded }));
    }
  };

  return (
    <div className="flex justify-center">
      <Button
        size="lg"
        onClick={handleClaim}
        disabled={!canClaim}
        className="w-full"
      >
        {allClaimed
          ? t('missions.claimed')
          : canClaim
            ? `${t('missions.claimAll')} (+${unclaimedDrops} 💧)`
            : t('missions.noClaim')}
      </Button>
    </div>
  );
}
