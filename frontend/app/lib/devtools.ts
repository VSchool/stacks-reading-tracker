// Local dev helpers. Off by default; turned on by visiting any page with
// ?debug=1 (persisted to localStorage). Lets a developer force a page into a
// particular async state and add artificial latency while testing.

const FLAG_KEY = 'stacks_debug';
const STATE_KEY = 'stacks_force_state';
const THROTTLE_KEY = 'stacks_throttle';

export type ForcedState = 'loading' | 'error' | 'empty' | '';

export function syncFlagFromUrl() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug') === '1') {
    window.localStorage.setItem(FLAG_KEY, '1');
  } else if (params.get('debug') === '0') {
    window.localStorage.removeItem(FLAG_KEY);
  }
}

export function isDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(FLAG_KEY) === '1';
}

export function getForcedState(): ForcedState {
  if (typeof window === 'undefined') return '';
  return (window.localStorage.getItem(STATE_KEY) as ForcedState) || '';
}

export function setForcedState(state: ForcedState) {
  if (state) {
    window.localStorage.setItem(STATE_KEY, state);
  } else {
    window.localStorage.removeItem(STATE_KEY);
  }
  window.dispatchEvent(new Event('stacks-devtools-change'));
}

export function getThrottleMs(): number {
  if (typeof window === 'undefined') return 0;
  return Number(window.localStorage.getItem(THROTTLE_KEY) || '0');
}

export function setThrottleMs(ms: number) {
  window.localStorage.setItem(THROTTLE_KEY, String(ms));
  window.dispatchEvent(new Event('stacks-devtools-change'));
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
