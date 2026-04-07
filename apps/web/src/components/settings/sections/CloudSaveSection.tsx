'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useGameStore } from '@/store/gameStore';
import { useCloudSyncStore } from '@/store/cloudSyncStore';
import { toast } from '@/lib/toast';
import { useT } from '@/i18n/useT';

/**
 * Cloud Save section — sign in with Google, sync to/from Google Drive.
 *
 * On sign-in, if a cloud save exists and is newer than the local save,
 * the user is prompted to choose which one to keep. Auto-sync uploads
 * to Drive on every local save (debounced 5s in debouncedSave.ts).
 */
export function CloudSaveSection() {
  const t = useT();
  const state = useGameStore((s) => s.state);
  const replaceState = useGameStore((s) => s.replaceState);

  const signedIn = useCloudSyncStore((s) => s.signedIn);
  const syncStatus = useCloudSyncStore((s) => s.syncStatus);
  const lastError = useCloudSyncStore((s) => s.lastError);
  const lastSyncedAt = useCloudSyncStore((s) => s.lastSyncedAt);
  const signIn = useCloudSyncStore((s) => s.signIn);
  const signOut = useCloudSyncStore((s) => s.signOut);
  const syncToCloud = useCloudSyncStore((s) => s.syncToCloud);
  const syncFromCloud = useCloudSyncStore((s) => s.syncFromCloud);
  const isConfigured = useCloudSyncStore((s) => s.isConfigured);

  const [showConflict, setShowConflict] = useState(false);
  const [cloudData, setCloudData] = useState<
    import('@florify/shared').PlayerState | null
  >(null);

  const isSyncing = syncStatus === 'syncing';

  const handleSignIn = async () => {
    const cloud = await signIn();
    if (!cloud) {
      // No cloud data or error — push local to cloud
      if (useCloudSyncStore.getState().signedIn) {
        await syncToCloud(state);
        toast(t('cloud.syncSuccess'));
      }
      return;
    }

    // Cloud data exists — compare timestamps
    if (cloud.updatedAt > state.updatedAt) {
      // Cloud is newer — ask user
      setCloudData(cloud);
      setShowConflict(true);
    } else {
      // Local is newer or equal — push to cloud
      await syncToCloud(state);
      toast(t('cloud.syncSuccess'));
    }
  };

  const handleUseCloud = () => {
    if (cloudData) {
      replaceState(cloudData);
      toast(t('cloud.syncSuccess'));
    }
    setShowConflict(false);
    setCloudData(null);
  };

  const handleUseLocal = async () => {
    setShowConflict(false);
    setCloudData(null);
    await syncToCloud(state);
    toast(t('cloud.syncSuccess'));
  };

  const handleSignOut = () => {
    signOut();
  };

  const handleSyncNow = async () => {
    await syncToCloud(state);
    toast(t('cloud.syncSuccess'));
  };

  const handlePullFromCloud = async () => {
    const cloud = await syncFromCloud();
    if (cloud) {
      replaceState(cloud);
      toast(t('cloud.syncSuccess'));
    }
  };

  if (!isConfigured()) {
    return null;
  }

  return (
    <section>
      <h2 className="text-sm font-medium text-ink-500 uppercase tracking-wider mb-3">
        {t('cloud.title')}
      </h2>
      <Card className="p-4 space-y-3">
        <div className="text-sm text-ink-700">{t('cloud.hint')}</div>

        {!signedIn ? (
          <Button
            variant="secondary"
            size="md"
            onClick={handleSignIn}
            disabled={isSyncing}
            className="w-full"
          >
            {isSyncing ? t('cloud.syncing') : t('cloud.signIn')}
          </Button>
        ) : (
          <>
            {/* Sync status */}
            <div className="flex items-center justify-between text-xs text-ink-500">
              <span>
                {lastSyncedAt
                  ? t('cloud.lastSynced', {
                      time: new Date(lastSyncedAt).toLocaleTimeString(),
                    })
                  : t('cloud.neverSynced')}
              </span>
              {isSyncing && (
                <span className="text-clay-500 animate-pulse">
                  {t('cloud.syncing')}
                </span>
              )}
            </div>

            {lastError && (
              <div className="text-xs text-danger">
                {t('cloud.syncError', { reason: lastError })}
              </div>
            )}

            {/* Conflict resolution dialog */}
            {showConflict && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                <div className="text-sm font-medium text-amber-800">
                  {t('cloud.conflictTitle')}
                </div>
                <div className="text-xs text-amber-700">
                  {t('cloud.conflictMsg')}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleUseCloud}
                    className="flex-1"
                  >
                    {t('cloud.useCloud')}
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleUseLocal}
                    className="flex-1"
                  >
                    {t('cloud.useLocal')}
                  </Button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="flex-1"
              >
                {t('cloud.pushToCloud')}
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handlePullFromCloud}
                disabled={isSyncing}
                className="flex-1"
              >
                {t('cloud.pullFromCloud')}
              </Button>
            </div>

            <Button
              variant="ghost"
              size="md"
              onClick={handleSignOut}
              className="w-full text-ink-500"
            >
              {t('cloud.signOut')}
            </Button>
          </>
        )}
      </Card>
    </section>
  );
}
