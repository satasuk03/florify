import { STORAGE_KEY, type PlayerState } from '@florify/shared';
import { migrate } from './migrations';

export interface SaveStore {
  load(): Promise<PlayerState | null>;
  save(state: PlayerState): Promise<void>;
  clear(): Promise<void>;
}

export class LocalSaveStore implements SaveStore {
  async load(): Promise<PlayerState | null> {
    try {
      if (typeof window === 'undefined') return null;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { schemaVersion: number } & Record<string, unknown>;
      return migrate(parsed);
    } catch (err) {
      console.error('[SaveStore] load failed', err);
      return null;
    }
  }

  async save(state: PlayerState): Promise<void> {
    if (typeof window === 'undefined') return;
    const payload: PlayerState = { ...state, updatedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export const saveStore: SaveStore = new LocalSaveStore();
