const mongoose = require('mongoose');
const config = require('./config');

mongoose.set('strictQuery', true);

// Cache the connection across warm serverless invocations. Storing the state on
// the global object means it survives module re-evaluation within the same
// instance, so we don't open a brand-new connection on every request.
let cached = global.__stacksMongoose;
if (!cached) {
  cached = global.__stacksMongoose = { promise: null, listeners: false };
}

// When the socket drops (cluster restart, M0 auto-pause, transient blip), clear
// the cached promise so the NEXT request starts a fresh connection instead of
// awaiting a stale, already-resolved promise. This is what lets a poisoned warm
// instance self-heal once the database comes back — no redeploy required.
if (!cached.listeners) {
  mongoose.connection.on('disconnected', () => {
    cached.promise = null;
  });
  mongoose.connection.on('error', () => {
    cached.promise = null;
  });
  cached.listeners = true;
}

async function connectDB() {
  // Already connected — reuse it.
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // No attempt in flight — start one. Fail fast (8s) rather than hanging on the
  // 30s default, and clear the cached promise on failure so the next request
  // retries a fresh connection.
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(config.mongoUri, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000,
        socketTimeoutMS: 20000,
      })
      .then((m) => {
        console.log('MongoDB connected');
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  await cached.promise;
  return mongoose.connection;
}

module.exports = connectDB;
