'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/Button';
import { CheckIcon } from '@/components/icons';
import { useGameStore } from '@/store/gameStore';
import { useT } from '@/i18n/useT';
import { toast } from '@/lib/toast';
import { haptic } from '@/lib/haptics';
import {
  MISSION_MILESTONES,
  MISSION_MILESTONE_DROPS,
  MISSION_POINTS_PER,
  type DailyMission,
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
        className="w-full sm:max-w-md bg-cream-50 rounded-t-3xl sm:rounded-3xl shadow-soft-lg max-h-[92dvh] overflow-y-auto scrollbar-elegant animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative header with gradient */}
        <div className="relative overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-b from-leaf-500/8 to-transparent pointer-events-none" />
          <div className="relative px-6 pt-6 pb-4">
            <Header onClose={onClose} />
          </div>
        </div>

        <div className="px-6 pb-6">
          <MilestoneBar />
          <MissionList />
          <ClaimButton />
        </div>
      </div>
    </div>
  );
}

// ── Header ──────────────────────────────────────────────────────────

function Header({ onClose }: { onClose: () => void }) {
  const t = useT();
  return (
    <div className="flex justify-between items-start">
      <div>
        <h2 className="font-serif text-2xl text-ink-900 tracking-tight">
          {t('missions.title')}
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-ink-400 mt-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-leaf-500 animate-pulse" />
          {t('missions.resetIn', { time: '' })}
          <MidnightCountdown />
        </div>
      </div>
      <button
        onClick={onClose}
        aria-label={t('missions.close')}
        className="text-ink-400 text-xl leading-none w-9 h-9 flex items-center justify-center hover:bg-cream-100 rounded-full transition-colors -mt-0.5 -mr-1"
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
    <span className="tabular-nums font-mono font-medium text-ink-500">
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
    <div className="mb-5 rounded-2xl bg-cream-100 border border-cream-200 p-4"
      style={{ animation: 'mission-card-in 500ms cubic-bezier(0.22, 1, 0.36, 1) both', animationDelay: '80ms' }}
    >
      {/* Points display */}
      <div className="flex items-baseline justify-between mb-2.5">
        <div className="flex items-baseline gap-1">
          <span className="font-serif text-lg font-bold text-ink-900 tabular-nums">{totalPoints}</span>
          <span className="text-xs text-ink-400">/ {maxPoints}P</span>
        </div>
      </div>

      {/* Track */}
      <div className="relative h-2 bg-cream-300/60 rounded-full overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-leaf-500 to-leaf-300 rounded-full"
          style={{
            width: `${fillPct}%`,
            transformOrigin: 'left',
            animation: 'mission-progress-fill 800ms cubic-bezier(0.22, 1, 0.36, 1) both',
            animationDelay: '300ms',
          }}
        >
          {/* Shimmer on the progress bar */}
          {fillPct > 0 && (
            <div
              className="absolute inset-0 overflow-hidden rounded-full"
              aria-hidden
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                style={{ animation: 'shimmer-sweep 2s ease-in-out infinite', animationDelay: '1s' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Milestone markers */}
      <div className="flex justify-between">
        {MISSION_MILESTONES.map((milestone, i) => {
          const drops = MISSION_MILESTONE_DROPS[i]!;
          const reached = totalPoints >= milestone;
          const claimed = claimedMilestones.includes(milestone);
          const isNext = !reached && (i === 0 || totalPoints >= MISSION_MILESTONES[i - 1]!);
          return (
            <div
              key={milestone}
              className="flex flex-col items-center gap-1.5"
              style={{
                animation: 'mission-card-in 400ms cubic-bezier(0.22, 1, 0.36, 1) both',
                animationDelay: `${400 + i * 60}ms`,
              }}
            >
              <div
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 ${
                  claimed
                    ? 'bg-leaf-500 border-leaf-600 text-cream-50 shadow-[0_0_12px_rgba(107,142,78,0.4)]'
                    : reached
                      ? 'bg-leaf-100 border-leaf-400 text-leaf-700'
                      : isNext
                        ? 'bg-cream-50 border-cream-400 text-ink-500'
                        : 'bg-cream-50 border-cream-300 text-ink-300'
                }`}
                style={
                  reached && !claimed
                    ? { animation: 'milestone-glow 2s ease-in-out infinite' }
                    : claimed
                      ? { animation: 'milestone-unlock 500ms cubic-bezier(0.22, 1, 0.36, 1) both' }
                      : undefined
                }
              >
                {claimed ? (
                  <CheckIcon size={16} />
                ) : (
                  <span className="flex items-center gap-0.5">
                    <span
                      style={reached ? { animation: 'drop-icon-wobble 600ms ease-in-out' } : undefined}
                    >
                      💧
                    </span>
                  </span>
                )}
              </div>
              <div className="flex flex-col items-center">
                <span className={`text-[10px] font-bold tabular-nums ${
                  claimed ? 'text-leaf-600' : reached ? 'text-leaf-500' : 'text-ink-300'
                }`}>
                  +{drops}
                </span>
                <span className={`text-[9px] tabular-nums ${reached ? 'text-ink-500' : 'text-ink-300'}`}>
                  {milestone}P
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Mission List ────────────────────────────────────────────────────

const MISSION_LABEL_KEYS: Record<string, string> = {
  water: 'missions.water',
  plant: 'missions.plant',
  harvest: 'missions.harvest',
  harvest_rare: 'missions.harvest_rare',
  visit_gallery: 'missions.visit_gallery',
  visit_floripedia: 'missions.visit_floripedia',
  share_florist_card: 'missions.share_florist_card',
};

function missionLabel(t: ReturnType<typeof useT>, mission: DailyMission): string {
  const key = MISSION_LABEL_KEYS[mission.type] as Parameters<typeof t>[0];
  return t(key, { target: mission.target });
}

function MissionList() {
  const t = useT();
  const missions = useGameStore((s) => s.state.dailyMissions.missions);

  if (missions.length === 0) return null;

  return (
    <div className="space-y-2.5 mb-5">
      {missions.map((mission, i) => (
        <MissionCard
          key={mission.templateId}
          mission={mission}
          label={missionLabel(t, mission)}
          index={i}
        />
      ))}
    </div>
  );
}

function MissionCard({
  mission,
  label,
  index,
}: {
  mission: DailyMission;
  label: string;
  index: number;
}) {
  const progressPct = Math.min(100, (mission.progress / mission.target) * 100);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-3.5 flex items-center gap-3.5 transition-all duration-500 ${
        mission.completed
          ? 'bg-leaf-500/5 border-leaf-300/60 shadow-[0_0_0_1px_rgba(107,142,78,0.1)]'
          : 'bg-cream-100 border-cream-200 hover:border-cream-300 hover:shadow-soft-sm'
      }`}
      style={{
        animation: 'mission-card-in 480ms cubic-bezier(0.22, 1, 0.36, 1) both',
        animationDelay: `${200 + index * 80}ms`,
      }}
    >
      {/* Completed shimmer overlay */}
      {mission.completed && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-leaf-300/15 to-transparent"
            style={{ animation: 'shimmer-sweep 3s ease-in-out infinite', animationDelay: `${index * 400}ms` }}
          />
        </div>
      )}

      {/* Points badge */}
      <div className={`relative flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${
        mission.completed
          ? 'bg-leaf-500/15 border border-leaf-400/40'
          : 'bg-clay-500/10 border border-clay-400/25'
      }`}>
        <span className={`text-[11px] font-bold tracking-tight ${
          mission.completed ? 'text-leaf-700' : 'text-clay-600'
        }`}>
          {MISSION_POINTS_PER}P
        </span>
      </div>

      {/* Description + progress */}
      <div className="relative flex-1 min-w-0">
        <div className={`text-sm font-medium truncate transition-colors duration-300 ${
          mission.completed ? 'text-leaf-800' : 'text-ink-800'
        }`}>
          {label}
        </div>
        <div className="flex items-center gap-2.5 mt-1.5">
          <div className="flex-1 h-1.5 bg-cream-300/50 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                mission.completed
                  ? 'bg-gradient-to-r from-leaf-500 to-leaf-300'
                  : 'bg-gradient-to-r from-clay-500 to-clay-400'
              }`}
              style={{
                width: `${progressPct}%`,
                transformOrigin: 'left',
                animation: 'mission-progress-fill 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
                animationDelay: `${350 + index * 80}ms`,
              }}
            />
          </div>
          <span className={`text-[11px] tabular-nums font-mono flex-shrink-0 ${
            mission.completed ? 'text-leaf-600 font-medium' : 'text-ink-400'
          }`}>
            {mission.progress}/{mission.target}
          </span>
        </div>
      </div>

      {/* Status indicator */}
      <div className="relative flex-shrink-0">
        {mission.completed ? (
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-leaf-500 to-leaf-700 flex items-center justify-center shadow-[0_2px_8px_rgba(107,142,78,0.4)]"
            style={{
              animation: 'mission-check-pop 500ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
              animationDelay: `${400 + index * 80}ms`,
            }}
          >
            <CheckIcon size={15} className="text-cream-50" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full border-2 border-cream-300 bg-cream-50 transition-colors duration-300" />
        )}
      </div>
    </div>
  );
}

// ── Claim Button ────────────────────────────────────────────────────

function ClaimButton() {
  const t = useT();
  const missions = useGameStore((s) => s.state.dailyMissions.missions);
  const claimedMilestones = useGameStore((s) => s.state.dailyMissions.claimedMilestones);
  const claimMissions = useGameStore((s) => s.claimMissions);
  const [justClaimed, setJustClaimed] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const totalPoints = missions.filter((m) => m.completed).length * MISSION_POINTS_PER;

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

  const handleClaim = useCallback(() => {
    const { dropsAwarded } = claimMissions();
    if (dropsAwarded > 0) {
      haptic('harvest');
      setJustClaimed(true);
      setBurstKey((k) => k + 1);
      toast(t('missions.dropsAwarded', { drops: dropsAwarded }));
      setTimeout(() => setJustClaimed(false), 600);
    }
  }, [claimMissions, t]);

  return (
    <div
      className="relative"
      style={{
        animation: 'mission-card-in 480ms cubic-bezier(0.22, 1, 0.36, 1) both',
        animationDelay: '600ms',
      }}
    >
      {burstKey > 0 && <ClaimBurst key={burstKey} />}
      <Button
        size="lg"
        onClick={handleClaim}
        disabled={!canClaim}
        className={`relative w-full !rounded-2xl font-serif tracking-wide transition-all duration-300 ${justClaimed ? 'scale-[0.96]' : ''}`}
        style={canClaim ? { animation: 'claim-btn-glow 2.5s ease-in-out infinite' } : undefined}
      >
        <span className="flex items-center justify-center gap-2">
          {allClaimed ? (
            <>
              <CheckIcon size={18} />
              {t('missions.claimed')}
            </>
          ) : canClaim ? (
            <>
              {t('missions.claimAll')}
              <span className="inline-flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-0.5 text-sm">
                <span style={{ animation: 'drop-icon-wobble 800ms ease-in-out infinite' }}>💧</span>
                +{unclaimedDrops}
              </span>
            </>
          ) : (
            t('missions.noClaim')
          )}
        </span>
      </Button>
    </div>
  );
}

// ── Claim Burst ─────────────────────────────────────────────────────

const BURST_COUNT = 10;

function ClaimBurst() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(id);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" aria-hidden>
      {Array.from({ length: BURST_COUNT }, (_, i) => {
        const angle = (i / BURST_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const dist = 50 + Math.random() * 40;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const delay = Math.random() * 80;
        const size = 14 + Math.random() * 8;
        return (
          <span
            key={i}
            className="absolute"
            style={{
              '--dx': `${dx}px`,
              '--dy': `${dy}px`,
              fontSize: `${size}px`,
              animation: `claim-drop-burst 700ms cubic-bezier(0.22, 1, 0.36, 1) both`,
              animationDelay: `${delay}ms`,
            } as React.CSSProperties}
          >
            💧
          </span>
        );
      })}
    </div>
  );
}
