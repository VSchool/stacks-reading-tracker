'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, saveSession } from '../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      saveSession(data.token, data.user);
      router.push('/');
    } catch (err) {
      setError('Could not reach the server');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
      <h1>Log in</h1>
      <p className="subtle">Welcome back to Stacks.</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="notice notice-error">{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={submitting} style={{ marginTop: 12 }}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="subtle" style={{ marginTop: 16 }}>
        No account? <Link href="/signup">Sign up</Link>
      </p>
    </div>
  );
}
