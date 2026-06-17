'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, getToken } from '../../lib/api';

export default function NewBookPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('want');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) router.push('/login');
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    setError('');
    const res = await apiFetch('/books', {
      method: 'POST',
      body: JSON.stringify({ title, author, status, rating: Number(rating) }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Could not save the book');
      return;
    }
    router.push('/');
  }

  return (
    <div className="card" style={{ maxWidth: 520, margin: '20px auto' }}>
      <h1>Add a book</h1>
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
          Save book
        </button>
      </form>
    </div>
  );
}
