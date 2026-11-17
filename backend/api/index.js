// Serverless entry point for hosting on Vercel.
// Reuses the same Express app from server.js. The per-request `ensure DB`
// middleware in server.js guarantees a live connection before any data route,
// so we don't depend on this connect succeeding — it's just a best-effort
// warmup to shave latency off the first request on a fresh instance. A failed
// attempt here is harmless: connectDB() clears its cached promise and retries.
const app = require('../server');
const connectDB = require('../config/db');

connectDB().catch(() => {});

module.exports = app;
