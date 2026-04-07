'use client';

import { create } from 'zustand';
import type { PlayerState } from '@florify/shared';
import {
  isGisLoaded,
  signIn as gdriveSignIn,
  signOut as gdriveSignOut,
  loadFromDrive,
  saveToDrive,
  refreshToken,
} from '@/lib/googleDrive';

// ── Google Client ID ────────────────────────────────────────────────────
// Set via NEXT_PUBLIC_GOOGLE_CLIENT_ID env var at build time.
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

const CLOUD_SIGNED_IN_KEY = 'florify:v1:cloudSignedIn';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface CloudSyncState {
  /** Whether the user has linked their Google account this session. */
  signedIn: boolean;
  /** Current sync operation status. */
  syncStatus: SyncStatus;
  /** Human-readable error from the last failed operation. */
  lastError: string | null;
  /** Epoch ms of the last successful cloud save/load. */
  lastSyncedAt: number | null;

  // Actions
  signIn: () => Promise<PlayerState | null>;
  signOut: () => void;
  syncToCloud: (state: PlayerState) => Promise<void>;
  syncFromCloud: () => Promise<PlayerState | null>;
  isConfigured: () => boolean;
}

export const useCloudSyncStore = create<CloudSyncState>((set, get) => ({
  signedIn: false,
  syncStatus: 'idle',
  lastError: null,
  lastSyncedAt: null,

  isConfigured: () => GOOGLE_CLIENT_ID.length > 0,

  /**
   * Sign in with Google, then load the cloud save (if any).
   * Returns the cloud state if it exists and is newer, otherwise null.
   */
  signIn: async () => {
    if (!GOOGLE_CLIENT_ID) {
      set({ lastError: 'Google Client ID not configured' });
      return null;
    }
    try {
      set({ syncStatus: 'syncing', lastError: null });
      await gdriveSignIn(GOOGLE_CLIENT_ID);
      set({ signedIn: true });
      persistSignedIn(true);

      // Attempt to load cloud save
      const cloudState = await loadFromDrive();
      set({ syncStatus: 'success', lastSyncedAt: Date.now() });
      return cloudState;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed';
      set({ syncStatus: 'error', lastError: msg, signedIn: false });
      persistSignedIn(false);
      return null;
    }
  },

  signOut: () => {
    gdriveSignOut();
    set({
      signedIn: false,
      syncStatus: 'idle',
      lastError: null,
      lastSyncedAt: null,
    });
    persistSignedIn(false);
  },

  /**
   * Upload the current state to Google Drive.
   * Silently refreshes the token if expired.
   */
  syncToCloud: async (state: PlayerState) => {
    if (!get().signedIn) return;
    try {
      set({ syncStatus: 'syncing', lastError: null });
      await saveToDrive(state);
      set({ syncStatus: 'success', lastSyncedAt: Date.now() });
    } catch (err) {
      // If token expired, try a silent refresh and retry once
      if (err instanceof Error && err.message.includes('Not authenticated')) {
        try {
          await refreshToken(GOOGLE_CLIENT_ID);
          await saveToDrive(state);
          set({ syncStatus: 'success', lastSyncedAt: Date.now() });
          return;
        } catch {
          // fall through to error
        }
      }
      const msg = err instanceof Error ? err.message : 'Sync failed';
      set({ syncStatus: 'error', lastError: msg });
    }
  },

  /**
   * Download the cloud save from Google Drive.
   */
  syncFromCloud: async () => {
    if (!get().signedIn) return null;
    try {
      set({ syncStatus: 'syncing', lastError: null });
      const cloudState = await loadFromDrive();
      set({ syncStatus: 'success', lastSyncedAt: Date.now() });
      return cloudState;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Load failed';
      set({ syncStatus: 'error', lastError: msg });
      return null;
    }
  },
}));

// ── Persistence helpers ─────────────────────────────────────────────────
// We persist only a boolean flag so we know whether to show "signed in"
// on next visit. The actual token is NOT persisted — GIS handles that.
function persistSignedIn(value: boolean): void {
  if (typeof window === 'undefined') return;
  if (value) {
    window.localStorage.setItem(CLOUD_SIGNED_IN_KEY, '1');
  } else {
    window.localStorage.removeItem(CLOUD_SIGNED_IN_KEY);
  }
}

export function wasSignedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(CLOUD_SIGNED_IN_KEY) === '1';
}
