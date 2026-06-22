'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, getToken, BookSearchResult } from '../../lib/api';

export default function NewBookPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<BookSearchResult | null>(null);
  const [status, setStatus] = useState('want');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) router.push('/login');
  }, [router]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSelected(null);
    setSearching(true);
    try {
      const res = await apiFetch(`/books/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('search failed');
      setResults(await res.json());
      setSearched(true);
    } catch (err) {
      setError('Book lookup is unavailable right now.');
    } finally {
      setSearching(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    setError('');
    if (!selected) return;
    const res = await apiFetch('/books', {
      method: 'POST',
      body: JSON.stringify({
        title: selected.title,
        author: selected.author,
        status,
        rating: 0,
        coverUrl: selected.coverUrl,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Could not save the book');
      return;
    }
    router.push('/');
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: '20px auto' }}>
      <h1>Add a book</h1>
      <p className="subtle">Search the catalog, then add it to your list.</p>

      <form onSubmit={handleSearch}>
        <div className="toolbar" style={{ margin: '8px 0 16px' }}>
          <input
            type="text"
            placeholder="Search by title or author…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" type="submit" disabled={searching}>
            {searching ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      {error && <div className="notice notice-error">{error}</div>}

      {!selected && searched && results.length === 0 && !searching && (
        <p className="subtle">No matches. Try a different search.</p>
      )}

      {!selected && results.length > 0 && (
        <ul className="book-list">
          {results.map((r, i) => (
            <li className="book-card" key={i}>
              <img
                src={r.coverUrl || 'https://via.placeholder.com/40x60?text=%20'}
                alt=""
                width={40}
                height={60}
                style={{ objectFit: 'cover', borderRadius: 4, background: '#eee' }}
              />
              <div className="meta">
                <div className="title">{r.title}</div>
                <div className="author">
                  {r.author}
                  {r.year ? ` · ${r.year}` : ''}
                </div>
              </div>
              <button className="btn" onClick={() => setSelected(r)}>
                Select
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <form onSubmit={handleAdd}>
          <div className="book-card" style={{ marginBottom: 16 }}>
            <img
              src={selected.coverUrl || 'https://via.placeholder.com/40x60?text=%20'}
              alt=""
              width={40}
              height={60}
              style={{ objectFit: 'cover', borderRadius: 4, background: '#eee' }}
            />
            <div className="meta">
              <div className="title">{selected.title}</div>
              <div className="author">{selected.author}</div>
            </div>
            <button type="button" className="btn" onClick={() => setSelected(null)}>
              Change
            </button>
          </div>

          <div className="field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="want">Want to read</option>
              <option value="reading">Reading</option>
              <option value="finished">Finished</option>
            </select>
          </div>

          <button className="btn btn-primary" type="submit" style={{ marginTop: 12 }}>
            Add to my list
          </button>
        </form>
      )}
    </div>
  );
}
