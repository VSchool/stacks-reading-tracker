// Small client for the Stacks API.

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export type Book = {
  _id: string;
  title: string;
  author: string;
  status: 'reading' | 'finished' | 'want';
  rating: number;
  favorite: boolean;
  coverUrl?: string;
  userId: string;
  createdAt: string;
};

export type BookSearchResult = {
  title: string;
  author: string;
  year: number | null;
  coverUrl: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export type Stats = {
  total: number;
  reading: number;
  finished: number;
  want: number;
  favorites: number;
};

const TOKEN_KEY = 'stacks_token';
const USER_KEY = 'stacks_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function saveSession(token: string, user: User) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  return res;
}
