'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch, getToken } from '../../../lib/api';

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('want');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    async function load() {
      try {
        const res = await apiFetch(`/books/${id}`);
        if (!res.ok) throw new Error('not found');
        const book = await res.json();
        setTitle(book.title);
        setAuthor(book.author);
        setStatus(book.status);
        setRating(book.rating);
      } catch (e) {
        setError('Could not load this book.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await apiFetch(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, author, status, rating: Number(rating) }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Could not save changes');
      return;
    }
    router.push(`/books/${id}`);
  }

  if (loading) return <div className="center-state">Loading…</div>;

  return (
    <div className="card" style={{ maxWidth: 520, margin: '20px auto' }}>
      <h1>Edit book</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="field">
          <label>Author</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
        <div className="field">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="want">Want to read</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
          </select>
        </div>
        <div className="field">
          <label>Rating (0–5)</label>
          <input
            type="number"
            min={0}
            max={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
        </div>
        {error && <div className="notice notice-error">{error}</div>}
        <button className="btn btn-primary" type="submit" style={{ marginTop: 12 }}>
          Save changes
        </button>
      </form>
    </div>
  );
}
