const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const statsRoutes = require('./routes/stats');

const app = express();

// Global middleware
app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());
app.use(logger);

// Health check — must stay DB-free so it reports 200 even when Mongo is down.
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'stacks-api' });
});

// Ensure a live DB connection before any data route. connectDB() reuses the
// cached connection when healthy and retries when it isn't, so a transient
// outage self-heals on the next request instead of poisoning the instance.
// On failure, respond fast with 503 rather than letting queries buffer ~10s.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error', err);
    res.status(503).json({ error: 'Service temporarily unavailable' });
  }
});

// Auth (public)
app.use('/', authRoutes);

// Books (protected)
app.use('/books', auth, bookRoutes);

// Stats
app.use('/stats', statsRoutes);

async function start() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Stacks API listening on port ${config.port}`);
  });
}

// Only start a listening server when run directly (local dev).
// When imported (e.g. by a serverless host), the app is exported instead.
if (require.main === module) {
  start().catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
}

module.exports = app;
