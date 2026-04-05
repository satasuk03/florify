'use client';

import { useEffect } from 'react';
import { AccountSection } from './sections/AccountSection';
import { PreferencesSection } from './sections/PreferencesSection';
import { SaveDataSection } from './sections/SaveDataSection';
import { DangerZoneSection } from './sections/DangerZoneSection';

/**
 * Settings bottom sheet — slides up from the bottom on mobile, centers
 * on desktop. Built to match the `FloristCardSheet` pattern (same
 * overlay, animations, dismiss behavior) so both sheets feel like the
 * same family.
 *
 * The inner sections (Account / Preferences / Save data / Danger zone)
 * are shared with the full-page `/settings` route so there's a single
 * source of truth for the settings UI.
 */
interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsSheet({ open, onClose }: Props) {
  // Dismiss on Escape. Attach only while open so background shortcuts
  // still work when the sheet is closed.
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
      aria-label="Settings"
    >
      <div
        className="w-full sm:max-w-md bg-cream-50 rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg max-h-[92dvh] overflow-y-auto scrollbar-elegant animate-sheet-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-serif text-2xl text-ink-900">Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-ink-500 text-2xl leading-none w-10 h-10 flex items-center justify-center hover:bg-cream-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <AccountSection />
          <PreferencesSection />
          <SaveDataSection />
          <DangerZoneSection />
        </div>
      </div>
    </div>
  );
}
