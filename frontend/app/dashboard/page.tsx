'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, getToken, Stats } from '../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    async function load() {
      try {
        const res = await apiFetch('/stats');
        if (!res.ok) throw new Error('failed');
        setStats(await res.json());
      } catch (e) {
        setError('Could not load your stats.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  if (loading) return <div className="center-state">Loading…</div>;
  if (error || !stats) return <div className="notice notice-error">{error || 'No stats'}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="subtle">A quick look at your reading.</p>
      <div className="stat-grid" style={{ marginTop: 20 }}>
        <div className="stat">
          <div className="num">{stats.total}</div>
          <div className="label">Total books</div>
        </div>
        <div className="stat">
          <div className="num">{stats.reading}</div>
          <div className="label">Reading</div>
        </div>
        <div className="stat">
          <div className="num">{stats.finished}</div>
          <div className="label">Finished</div>
        </div>
        <div className="stat">
          <div className="num">{stats.want}</div>
          <div className="label">Want to read</div>
        </div>
        <div className="stat">
          <div className="num">{stats.favorites}</div>
          <div className="label">Favorites</div>
        </div>
      </div>
    </div>
  );
}
