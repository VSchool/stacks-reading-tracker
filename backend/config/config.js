// Central config. Reads from environment with sane defaults for local dev.
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stacks',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-123',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
};
