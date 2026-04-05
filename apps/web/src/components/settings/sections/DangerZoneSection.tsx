'use client';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useGameStore } from '@/store/gameStore';
import { toast } from '@/lib/toast';
import { useT } from '@/i18n/useT';

export function DangerZoneSection() {
  const t = useT();
  const resetAllProgress = useGameStore((s) => s.resetAllProgress);

  const handleReset = () => {
    const confirmed =
      typeof window !== 'undefined' &&
      window.confirm(t('settings.resetConfirm'));
    if (!confirmed) return;
    resetAllProgress();
    toast(t('settings.resetSuccess'));
  };

  return (
    <section>
      <h2 className="text-sm font-medium text-ink-500 uppercase tracking-wider mb-3">
        {t('settings.dangerZone')}
      </h2>
      <Card className="p-4 border-danger/30">
        <div className="text-sm text-ink-700 mb-3">
          {t('settings.dangerHint')}
        </div>
        <Button
          variant="secondary"
          onClick={handleReset}
          className="w-full border-danger/40 text-danger"
        >
          {t('settings.resetAll')}
        </Button>
      </Card>
    </section>
  );
}
