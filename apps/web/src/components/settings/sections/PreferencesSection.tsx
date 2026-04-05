'use client';

import { useSyncExternalStore } from 'react';
import type { Settings } from '@florify/shared';
import { Card } from '@/components/Card';
import { Toggle } from '@/components/Toggle';
import { loadSettings, saveSettings, subscribeSettings } from '@/store/settingsStore';
import { toast } from '@/lib/toast';
import { requestNotificationPermission } from '@/lib/notifications';
import { useT } from '@/i18n/useT';

type ToggleKey = 'sound' | 'haptics' | 'notifications';

interface ToggleRow {
  key: ToggleKey;
  label: string;
  hint?: string;
}

// Stable server snapshot for useSyncExternalStore — must live outside
// the component so its reference doesn't churn between renders.
const getServerSnapshot = (): Settings | null => null;

export function PreferencesSection() {
  const t = useT();
  const settings = useSyncExternalStore(subscribeSettings, loadSettings, getServerSnapshot);

  const rows: ToggleRow[] = [
    { key: 'sound', label: t('settings.sound'), hint: t('settings.soundHint') },
    { key: 'haptics', label: t('settings.haptics'), hint: t('settings.hapticsHint') },
    {
      key: 'notifications',
      label: t('settings.notifications'),
      hint: t('settings.notificationsHint'),
    },
  ];

  const updateToggle = async (key: ToggleKey, value: boolean) => {
    if (!settings) return;
    if (key === 'notifications' && value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast(t('settings.notificationsDenied'));
        return;
      }
    }
    const next: Settings = { ...settings, [key]: value };
    saveSettings(next);
  };

  if (!settings) return null;

  return (
    <section>
      <h2 className="text-sm font-medium text-ink-500 uppercase tracking-wider mb-3">
        {t('settings.preferences')}
      </h2>
      <div className="space-y-3">
        {rows.map((row) => (
          <Card
            key={row.key}
            className="p-4 flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="text-base text-ink-900">{row.label}</div>
              {row.hint && <div className="text-xs text-ink-500 mt-0.5">{row.hint}</div>}
            </div>
            <Toggle
              checked={settings[row.key]}
              onChange={(v) => updateToggle(row.key, v)}
              label={row.label}
            />
          </Card>
        ))}
      </div>
    </section>
  );
}
