// Serverless entry point for hosting on Vercel.
// Reuses the same Express app from server.js; opens the DB connection once
// per warm instance (Mongoose buffers queries until it's ready).
const app = require('../server');
const connectDB = require('../config/db');

connectDB().catch((err) => console.error('DB connection error', err));

module.exports = app;
