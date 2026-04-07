'use client';

import Link from 'next/link';
import { BackIcon } from '@/components/icons';
import { AccountSection } from '@/components/settings/sections/AccountSection';
import { PreferencesSection } from '@/components/settings/sections/PreferencesSection';
import { SaveDataSection } from '@/components/settings/sections/SaveDataSection';
import { CloudSaveSection } from '@/components/settings/sections/CloudSaveSection';
import { DangerZoneSection } from '@/components/settings/sections/DangerZoneSection';

/**
 * Full-page settings route at `/settings`. The sections themselves
 * are shared with `SettingsSheet` (the bottom sheet opened from the
 * home screen) so both entry points stay in lockstep.
 */
export function SettingsView() {
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

      <div className="mt-4 space-y-8 animate-fade-up">
        <AccountSection />
        <PreferencesSection />
        <CloudSaveSection />
        <SaveDataSection />
        <DangerZoneSection />
      </div>
    </div>
  );
}
