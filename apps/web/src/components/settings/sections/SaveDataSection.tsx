'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useGameStore } from '@/store/gameStore';
import { exportSaveString, importSaveString } from '@/lib/saveTransfer';
import { toast } from '@/lib/toast';
import { useT } from '@/i18n/useT';

/**
 * Export/import save data as a copy-pasteable base64 string. The user
 * can stash it in a note, send to themselves, and restore later.
 *
 * Import uses `window.confirm` for the destructive step and then
 * reloads the page. Reload is the safest way to rehydrate derived
 * state (active tree UI, cooldown timers, FloristCard selectors)
 * without hunting down every subscription.
 */
export function SaveDataSection() {
  const t = useT();
  const state = useGameStore((s) => s.state);
  const replaceState = useGameStore((s) => s.replaceState);
  const [mode, setMode] = useState<'idle' | 'importing'>('idle');
  const [pasted, setPasted] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      const encoded = await exportSaveString(state);
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(encoded);
        toast(t('settings.exportCopied'));
      } else {
        // Fallback: show the string in a prompt so the user can copy
        // manually on browsers where clipboard API is unavailable.
        window.prompt(t('settings.exportManualPrompt'), encoded);
      }
    } catch (err) {
      toast(t('settings.exportFailed', { reason: err instanceof Error ? err.message : 'unknown' }));
    }
  };

  const handleImportSubmit = async () => {
    setError(null);
    const result = await importSaveString(pasted);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    const confirmed = window.confirm(t('settings.importConfirm'));
    if (!confirmed) return;

    replaceState(result.state);
    toast(t('settings.importSuccess'));
    // Reload to rehydrate every derived subscription from the new
    // state cleanly. Small delay so the toast is visible first.
    setTimeout(() => window.location.reload(), 400);
  };

  return (
    <section>
      <h2 className="text-sm font-medium text-ink-500 uppercase tracking-wider mb-3">
        {t('settings.saveData')}
      </h2>
      <Card className="p-4 space-y-3">
        <div className="text-sm text-ink-700">
          {t('settings.saveDataHint')}
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="md" onClick={handleExport} className="flex-1">
            {t('settings.exportCopy')}
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              setMode((m) => (m === 'importing' ? 'idle' : 'importing'));
              setError(null);
              setPasted('');
            }}
            className="flex-1"
          >
            {mode === 'importing' ? t('settings.cancel') : t('settings.import')}
          </Button>
        </div>

        {mode === 'importing' && (
          <div className="space-y-2 pt-1">
            <textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              placeholder={t('settings.importPlaceholder')}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-cream-100 border border-cream-300 text-ink-900 placeholder:text-ink-400 text-xs font-mono focus:outline-none focus:border-clay-500 transition-colors resize-none"
            />
            {error && (
              <div className="text-xs text-danger">⚠️ {error}</div>
            )}
            <Button
              size="md"
              onClick={handleImportSubmit}
              disabled={pasted.trim().length === 0}
              className="w-full"
            >
              {t('settings.importSubmit')}
            </Button>
          </div>
        )}
      </Card>
    </section>
  );
}
