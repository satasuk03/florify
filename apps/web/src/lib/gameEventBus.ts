import type { GameEvent } from '@florify/shared';

type Listener = (event: GameEvent) => void;

const listeners = new Set<Listener>();

/**
 * Minimal typed event bus for game actions.
 *
 * Synchronous pub-sub — no async, no queuing. Actions emit events
 * after mutating store state; subscribers (e.g. mission tracker,
 * future achievement system) react to them without coupling back
 * into the action code.
 */
export const gameEventBus = {
  emit(event: GameEvent) {
    for (const fn of listeners) fn(event);
  },
  on(fn: Listener) {
    listeners.add(fn);
  },
  off(fn: Listener) {
    listeners.delete(fn);
  },
};
