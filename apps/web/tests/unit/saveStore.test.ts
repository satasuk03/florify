import { beforeEach, describe, expect, it } from 'vitest';
import { LocalSaveStore } from '@/store/saveStore';
import { createInitialState } from '@/store/initialState';
import { STORAGE_KEY } from '@florify/shared';

describe('LocalSaveStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns null when nothing has been saved', async () => {
    const store = new LocalSaveStore();
    expect(await store.load()).toBeNull();
  });

  it('round-trips save → load', async () => {
    const store = new LocalSaveStore();
    const initial = createInitialState();
    await store.save(initial);

    const loaded = await store.load();
    expect(loaded).not.toBeNull();
    expect(loaded?.userId).toBe(initial.userId);
    expect(loaded?.schemaVersion).toBe(1);
    expect(loaded?.activeTree).toBeNull();
    expect(loaded?.collection).toEqual([]);
  });

  it('stores under the florify namespaced key', async () => {
    const store = new LocalSaveStore();
    await store.save(createInitialState());
    expect(STORAGE_KEY).toBe('florify:v1:player');
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it('clear() removes the save', async () => {
    const store = new LocalSaveStore();
    await store.save(createInitialState());
    await store.clear();
    expect(await store.load()).toBeNull();
  });
});
