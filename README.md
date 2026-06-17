# Stacks — a personal reading tracker

Stacks is a small full-stack app for keeping track of the books you're reading,
want to read, and have finished. Log in, add books, rate them, and favorite the
ones you love.

## What's inside

```
stacks-reading-tracker/
  frontend/   Next.js (App Router, TypeScript) — the web app
  backend/    Express + MongoDB (Mongoose) — the JSON API
```

## Tech

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Backend:** Node + Express, MongoDB via Mongoose, JWT auth (bcrypt-hashed passwords)

## Running locally

You'll need Node 18+ and a running MongoDB (local `mongod` or an Atlas URI).

### 1. Backend

```bash
cd backend
npm install
# config defaults to mongodb://127.0.0.1:27017/stacks
npm run seed     # loads a small sample data set
npm run dev      # starts the API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
# point the app at the API (defaults to http://localhost:5000)
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm run dev      # starts the web app on http://localhost:3000
```

Open http://localhost:3000 and log in (or create an account).

## API

| Method | Route          | Description                  | Auth |
| ------ | -------------- | ---------------------------- | ---- |
| POST   | `/signup`      | Create an account            | —    |
| POST   | `/login`       | Log in, returns a JWT        | —    |
| GET    | `/books`       | List your books              | ✓    |
| GET    | `/books/:id`   | Get one book                 | ✓    |
| POST   | `/books`       | Create a book                | ✓    |
| PUT    | `/books/:id`   | Update a book                | ✓    |
| DELETE | `/books/:id`   | Delete a book                | ✓    |
| GET    | `/stats`       | Reading stats                | ✓    |

## Deploying

- **Frontend** → Vercel (set `NEXT_PUBLIC_API_URL` to the deployed API URL).
- **Backend** → Render or Railway (set `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`).
- **Database** → MongoDB Atlas.
