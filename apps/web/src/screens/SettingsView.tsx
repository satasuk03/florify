'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import type { Settings } from '@florify/shared';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { BackIcon } from '@/components/icons';
import { loadSettings, saveSettings, subscribeSettings } from '@/store/settingsStore';
import { useGameStore } from '@/store/gameStore';
import { toast } from '@/lib/toast';
import { requestNotificationPermission } from '@/lib/notifications';

/**
 * Minimal settings screen. Covers the four toggles from designs/03
 * plus the danger-zone reset. Deliberately sparse — settings grow
 * organically as features ship, we don't need to front-load a full UI.
 */

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

// Stable server snapshot for useSyncExternalStore. Must be declared
// outside the component so its reference doesn't change between
// renders (React requires a stable snapshot during SSR).
const getServerSnapshot = (): Settings | null => null;

export function SettingsView() {
  const settings = useSyncExternalStore(subscribeSettings, loadSettings, getServerSnapshot);
  const resetAllProgress = useGameStore((s) => s.resetAllProgress);

  const updateToggle = async (key: ToggleKey, value: boolean) => {
    if (!settings) return;

    // Notifications needs explicit browser permission before we allow
    // toggling the local setting on.
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

  const handleReset = () => {
    const confirmed =
      typeof window !== 'undefined' &&
      window.confirm('รีเซ็ตต้นไม้ทั้งหมดและสถิติ? การกระทำนี้ย้อนกลับไม่ได้');
    if (!confirmed) return;
    resetAllProgress();
    toast('รีเซ็ตข้อมูลเรียบร้อย');
  };

  return (
    <div className="min-h-full h-full overflow-y-auto bg-cream-50 safe-top safe-bottom px-4 pb-24">
      <header className="flex items-center justify-between py-4 animate-fade-down">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center text-ink-700 hover:bg-cream-100 rounded-full transition-all duration-300 ease-out hover:-translate-x-0.5"
          aria-label="Back to home"
        >
          <BackIcon />
        </Link>
        <h1 className="text-xl font-serif">Settings</h1>
        <div className="w-10" aria-hidden />
      </header>

      {settings && (
        <div className="space-y-3 mt-4">
          {ROWS.map((row, i) => (
            <Card
              key={row.key}
              className="p-4 flex items-center justify-between gap-4 animate-fade-up"
              style={{ animationDelay: `${i * 70 + 80}ms` }}
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
      )}

      <section
        className="mt-10 animate-fade-up"
        style={{ animationDelay: `${ROWS.length * 70 + 120}ms` }}
      >
        <h2 className="text-sm font-medium text-ink-500 uppercase tracking-wider mb-3">
          Danger zone
        </h2>
        <Card className="p-4 border-danger/30">
          <div className="text-sm text-ink-700 mb-3">
            รีเซ็ตต้นไม้ทุกต้น สถิติ และ streak ทั้งหมด
          </div>
          <Button
            variant="secondary"
            onClick={handleReset}
            className="w-full border-danger/40 text-danger"
          >
            รีเซ็ตข้อมูลทั้งหมด
          </Button>
        </Card>
      </section>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors duration-300 ease-out flex-shrink-0 ${
        checked ? 'bg-clay-500' : 'bg-cream-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-cream-50 shadow-soft-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
