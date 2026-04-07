'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/Button';
import { CheckIcon } from '@/components/icons';
import { useGameStore } from '@/store/gameStore';
import { useT } from '@/i18n/useT';
import { toast } from '@/lib/toast';
import { haptic } from '@/lib/haptics';
import { CHECKIN_BASE_DROPS, CHECKIN_STREAK_BONUS_MAX } from '@florify/shared';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CheckinModal({ open, onClose }: Props) {
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
      className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center animate-overlay-in p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('checkin.title')}
    >
      <div
        className="w-full max-w-sm bg-cream-50 rounded-3xl shadow-soft-lg overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-clay-400/10 to-transparent pointer-events-none" />
          <div className="relative px-6 pt-6 pb-2 text-center">
            <h2 className="font-serif text-2xl text-ink-900 tracking-tight">
              {t('checkin.title')}
            </h2>
            <StreakBadge />
          </div>
        </div>

        <div className="px-6 pb-6">
          <StreakTimeline />
          <RewardBreakdown />
          <ClaimSection onClose={onClose} />
        </div>
      </div>
    </div>
  );
}

// ── Streak Badge ────────────────────────────────────────────────────

function StreakBadge() {
  const t = useT();
  const streak = useGameStore((s) => s.state.streak.currentStreak);

  return (
    <div
      className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-clay-500/12 border border-clay-400/30"
      style={{
        animation: 'mission-card-in 500ms cubic-bezier(0.22, 1, 0.36, 1) both',
        animationDelay: '150ms',
      }}
    >
      <span className="text-lg">🔥</span>
      <span className="font-serif font-bold text-clay-600 text-sm">
        {t('checkin.streak', { count: streak })}
      </span>
    </div>
  );
}

// ── Streak Timeline ─────────────────────────────────────────────────

function StreakTimeline() {
  const streak = useGameStore((s) => s.state.streak.currentStreak);
  const currentDay = streak;

  // Build 7 slots: 3 past, today (center), 3 future
  const slots: Array<{ day: number; status: 'past' | 'today' | 'future' }> = [];
  for (let offset = -3; offset <= 3; offset++) {
    const day = currentDay + offset;
    if (day < 1) {
      slots.push({ day, status: 'future' }); // placeholder for days before streak started
    } else if (offset < 0) {
      slots.push({ day, status: 'past' });
    } else if (offset === 0) {
      slots.push({ day, status: 'today' });
    } else {
      slots.push({ day, status: 'future' });
    }
  }

  return (
    <div
      className="flex justify-between my-5 px-1"
      style={{
        animation: 'mission-card-in 500ms cubic-bezier(0.22, 1, 0.36, 1) both',
        animationDelay: '250ms',
      }}
    >
      {slots.map((slot, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
              slot.status === 'past' && slot.day >= 1
                ? 'bg-clay-500 border-clay-600 text-cream-50 shadow-[0_0_8px_rgba(199,130,90,0.3)]'
                : slot.status === 'today'
                  ? 'bg-clay-400/15 border-clay-400 text-clay-600'
                  : 'bg-cream-100 border-cream-200 text-ink-300'
            }`}
            style={
              slot.status === 'past' && slot.day >= 1
                ? { animation: 'mission-card-in 400ms cubic-bezier(0.22, 1, 0.36, 1) both', animationDelay: `${300 + i * 50}ms` }
                : slot.status === 'today'
                  ? { animation: 'milestone-glow 2s ease-in-out infinite' }
                  : undefined
            }
          >
            {slot.status === 'past' && slot.day >= 1 ? (
              <CheckIcon size={14} />
            ) : slot.day >= 1 ? (
              <span className="tabular-nums">{slot.day}</span>
            ) : null}
          </div>
          <span className={`text-[9px] tabular-nums font-medium ${
            slot.status === 'today' ? 'text-clay-600' : slot.status === 'past' && slot.day >= 1 ? 'text-ink-500' : 'text-ink-300'
          }`}>
            {slot.day >= 1 ? `Day ${slot.day}` : ''}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Reward Breakdown ────────────────────────────────────────────────

function RewardBreakdown() {
  const t = useT();
  const streak = useGameStore((s) => s.state.streak.currentStreak);
  const bonus = Math.min(Math.max(streak - 1, 0), CHECKIN_STREAK_BONUS_MAX);
  const base = CHECKIN_BASE_DROPS;
  const total = base + bonus;
  const isMax = bonus >= CHECKIN_STREAK_BONUS_MAX;

  return (
    <div
      className="rounded-2xl bg-cream-100 border border-cream-200 p-4 mb-5 space-y-2"
      style={{
        animation: 'mission-card-in 500ms cubic-bezier(0.22, 1, 0.36, 1) both',
        animationDelay: '350ms',
      }}
    >
      <div className="flex justify-between text-sm">
        <span className="text-ink-500">{t('checkin.base', { drops: base })}</span>
        <span className="text-ink-700 font-medium tabular-nums">💧 {base}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-ink-500 flex items-center gap-1.5">
          {t('checkin.bonus', { drops: bonus })}
          {isMax && (
            <span className="text-[10px] bg-clay-500/15 text-clay-600 font-bold px-1.5 py-0.5 rounded-full">
              {t('checkin.maxBonus')}
            </span>
          )}
        </span>
        <span className="text-ink-700 font-medium tabular-nums">💧 +{bonus}</span>
      </div>
      <div className="border-t border-cream-300 pt-2 flex justify-between">
        <span className="text-ink-700 font-medium">{t('checkin.total', { drops: total })}</span>
        <span className="font-serif font-bold text-clay-600 tabular-nums">💧 {total}</span>
      </div>
      {/* Bonus progress */}
      <div className="pt-1">
        <div className="h-1.5 bg-cream-300/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-clay-600 to-clay-400 rounded-full"
            style={{
              width: `${(bonus / CHECKIN_STREAK_BONUS_MAX) * 100}%`,
              transformOrigin: 'left',
              animation: 'mission-progress-fill 800ms cubic-bezier(0.22, 1, 0.36, 1) both',
              animationDelay: '500ms',
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-ink-300 mt-1 tabular-nums">
          <span>+0</span>
          <span>+{CHECKIN_STREAK_BONUS_MAX}</span>
        </div>
      </div>
    </div>
  );
}

// ── Claim Section ───────────────────────────────────────────────────

function ClaimSection({ onClose }: { onClose: () => void }) {
  const t = useT();
  const claimCheckin = useGameStore((s) => s.claimCheckin);
  const streak = useGameStore((s) => s.state.streak.currentStreak);
  const total = CHECKIN_BASE_DROPS + Math.min(Math.max(streak - 1, 0), CHECKIN_STREAK_BONUS_MAX);
  const [burstKey, setBurstKey] = useState(0);

  const handleClaim = useCallback(() => {
    const { dropsAwarded } = claimCheckin();
    if (dropsAwarded > 0) {
      haptic('harvest');
      setBurstKey((k) => k + 1);
      toast(t('missions.dropsAwarded', { drops: dropsAwarded }));
      setTimeout(onClose, 800);
    }
  }, [claimCheckin, t, onClose]);

  return (
    <div
      className="relative"
      style={{
        animation: 'mission-card-in 480ms cubic-bezier(0.22, 1, 0.36, 1) both',
        animationDelay: '450ms',
      }}
    >
      {burstKey > 0 && <ClaimBurst key={burstKey} />}
      <Button
        size="lg"
        onClick={handleClaim}
        className="relative w-full !rounded-2xl font-serif tracking-wide"
        style={{ animation: 'claim-btn-glow 2.5s ease-in-out infinite' }}
      >
        <span className="flex items-center justify-center gap-2">
          {t('checkin.claim')}
          <span className="inline-flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-0.5 text-sm">
            <span style={{ animation: 'drop-icon-wobble 800ms ease-in-out infinite' }}>💧</span>
            +{total}
          </span>
        </span>
      </Button>
    </div>
  );
}

// ── Claim Burst (reused pattern) ────────────────────────────────────

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
