'use client';

import { useSyncExternalStore } from 'react';
import type { Settings } from '@florify/shared';
import { Card } from '@/components/Card';
import { Toggle } from '@/components/Toggle';
import { loadSettings, saveSettings, subscribeSettings } from '@/store/settingsStore';
import { toast } from '@/lib/toast';
import { requestNotificationPermission } from '@/lib/notifications';

type ToggleKey = 'sound' | 'haptics' | 'notifications';

interface ToggleRow {
  key: ToggleKey;
  label: string;
  hint?: string;
}

const ROWS: ToggleRow[] = [
  { key: 'sound', label: 'เสียง', hint: 'เปิดเสียงเอฟเฟกต์ในเกม (เร็วๆ นี้)' },
  { key: 'haptics', label: 'Haptics (สั่น)', hint: 'Android รองรับ · iOS ไม่รองรับ' },
  {
    key: 'notifications',
    label: 'แจ้งเตือนรดน้ำ',
    hint: 'ทำงานเฉพาะตอน tab เปิดอยู่ (ไม่ใช่ PWA)',
  },
];

// Stable server snapshot for useSyncExternalStore — must live outside
// the component so its reference doesn't churn between renders.
const getServerSnapshot = (): Settings | null => null;

export function PreferencesSection() {
  const settings = useSyncExternalStore(subscribeSettings, loadSettings, getServerSnapshot);

  const updateToggle = async (key: ToggleKey, value: boolean) => {
    if (!settings) return;
    if (key === 'notifications' && value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast('ไม่ได้รับอนุญาต — ลองเปิดใน browser settings');
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
        Preferences
      </h2>
      <div className="space-y-3">
        {ROWS.map((row) => (
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
