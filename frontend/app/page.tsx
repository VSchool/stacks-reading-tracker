'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, getToken, Book } from './lib/api';
import { getForcedState, getThrottleMs, delay } from './lib/devtools';
import BookCard from './components/BookCard';

export default function BookListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    const forced = getForcedState();
    const throttleMs = getThrottleMs();
    if (throttleMs) await delay(throttleMs);

    if (forced === 'loading') {
      return; // leave the page in its loading state
    }
    if (forced === 'error') {
      setError('Could not load your books.');
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch('/books');
      if (!res.ok) throw new Error('request failed');
      let data: Book[] = await res.json();
      if (forced === 'empty') data = [];
      setBooks(data);
      const fav: Record<number, boolean> = {};
      data.forEach((b, i) => {
        fav[i] = b.favorite;
      });
      setFavorites(fav);
    } catch (e) {
      setError('Could not load your books.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    load();
    window.addEventListener('stacks-devtools-change', load);
    return () => window.removeEventListener('stacks-devtools-change', load);
  }, [load, router]);

  function toggleFavorite(index: number) {
    setFavorites((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  if (loading) {
    return <div className="center-state">Loading your books…</div>;
  }

  if (error) {
    return <div className="notice notice-error">{error}</div>;
  }

  const filtered = books.filter((b) => {
    const matchesStatus = filter === 'all' || b.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <h1>Your books</h1>
      <p className="subtle">Everything you&apos;re reading, want to read, and have finished.</p>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search title or author…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
          <option value="want">Want to read</option>
        </select>
        <Link href="/books/new" className="btn btn-primary" style={{ marginLeft: 'auto' }}>
          + Add book
        </Link>
      </div>

      <ul className="book-list">
        {filtered.map((book, index) => (
          <BookCard
            key={index}
            book={book}
            favorite={!!favorites[index]}
            onToggleFavorite={() => toggleFavorite(index)}
          />
        ))}
      </ul>
    </div>
  );
}
