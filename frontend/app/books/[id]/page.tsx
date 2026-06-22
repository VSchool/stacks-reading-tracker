'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch, getToken, Book } from '../../lib/api';

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    async function load() {
      try {
        const res = await apiFetch(`/books/${id}`);
        if (!res.ok) throw new Error('not found');
        setBook(await res.json());
      } catch (e) {
        setError('Could not load this book.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  async function handleDelete() {
    const res = await apiFetch(`/books/${id}`, { method: 'DELETE' });
    if (res.ok) router.push('/');
  }

  if (loading) return <div className="center-state">Loading…</div>;
  if (error || !book) return <div className="notice notice-error">{error || 'Not found'}</div>;

  return (
    <div className="card">
      <p className="subtle">
        <Link href="/">← Back to books</Link>
      </p>
      {book.coverUrl ? (
        <img
          src={book.coverUrl}
          alt=""
          width={90}
          height={135}
          style={{ objectFit: 'cover', borderRadius: 6, background: '#eee', float: 'right', marginLeft: 16 }}
        />
      ) : null}
      <h1>{book.title}</h1>
      <p className="author">by {book.author}</p>
      <p>
        <span className="badge">{book.status}</span>
      </p>
      <p>Rating: {book.rating} / 5</p>
      <p>{book.favorite ? '♥ Favorite' : '♡ Not a favorite'}</p>

      <div className="toolbar">
        <Link href={`/books/${book._id}/edit`} className="btn">
          Edit
        </Link>
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
