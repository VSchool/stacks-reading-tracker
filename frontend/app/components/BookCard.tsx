'use client';

import Link from 'next/link';
import { Book } from '../lib/api';

type BookCardProps = {
  book: Book;
  favorite: boolean;
  onToggleFavorite: () => void;
};

// Presentational card. Everything it shows comes in through props.
export default function BookCard({ book, favorite, onToggleFavorite }: BookCardProps) {
  return (
    <li className="book-card">
      {book.coverUrl ? (
        <img
          src={book.coverUrl}
          alt=""
          width={36}
          height={54}
          style={{ objectFit: 'cover', borderRadius: 4, background: '#eee' }}
        />
      ) : null}
      <div className="meta">
        <div className="title">
          <Link href={`/books/${book._id}`}>{book.title}</Link>
        </div>
        <div className="author">{book.author}</div>
      </div>
      <span className="badge">{book.status}</span>
      <button
        className={favorite ? 'heart on' : 'heart'}
        aria-label="Toggle favorite"
        onClick={onToggleFavorite}
      >
        {favorite ? '♥' : '♡'}
      </button>
    </li>
  );
}
