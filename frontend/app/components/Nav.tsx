'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, clearSession, User } from '../lib/api';
import { syncFlagFromUrl } from '../lib/devtools';

export default function Nav() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    syncFlagFromUrl();
    setUser(getUser());
  }, []);

  function handleLogout() {
    clearSession();
    setUser(null);
    router.push('/login');
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          📚 Stacks
        </Link>
        <div className="nav-links">
          <Link href="/">Books</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/about">About</Link>
          {user ? (
            <button className="btn" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <Link href="/login" className="btn btn-primary">
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
