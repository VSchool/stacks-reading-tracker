'use client';

import { useEffect, useState } from 'react';
import {
  isDebugEnabled,
  getForcedState,
  setForcedState,
  getThrottleMs,
  setThrottleMs,
  ForcedState,
} from '../lib/devtools';

// A small floating control panel, only visible when local debugging is on.
// Lets you force a page's async state and add network latency while testing.
export default function DevPanel() {
  const [enabled, setEnabled] = useState(false);
  const [forced, setForced] = useState<ForcedState>('');
  const [throttle, setThrottle] = useState(0);

  useEffect(() => {
    setEnabled(isDebugEnabled());
    setForced(getForcedState());
    setThrottle(getThrottleMs());
  }, []);

  if (!enabled) return null;

  return (
    <div className="dev-panel">
      <h4>Dev Tools</h4>
      <div className="dev-row">
        <label>Force state</label>
        <select
          value={forced}
          onChange={(e) => {
            const v = e.target.value as ForcedState;
            setForced(v);
            setForcedState(v);
          }}
        >
          <option value="">— normal —</option>
          <option value="loading">loading</option>
          <option value="error">error</option>
          <option value="empty">empty</option>
        </select>
      </div>
      <div className="dev-row">
        <label>Network delay</label>
        <select
          value={throttle}
          onChange={(e) => {
            const v = Number(e.target.value);
            setThrottle(v);
            setThrottleMs(v);
          }}
        >
          <option value={0}>none</option>
          <option value={1500}>1.5s</option>
          <option value={4000}>4s</option>
        </select>
      </div>
      <button
        className="btn"
        onClick={() => {
          setForced('');
          setForcedState('');
          setThrottle(0);
          setThrottleMs(0);
        }}
      >
        Reset
      </button>
    </div>
  );
}
