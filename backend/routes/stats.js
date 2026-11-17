const express = require('express');
const jwt = require('jsonwebtoken');
const Book = require('../models/Book');
const config = require('../config/config');

const router = express.Router();

// GET /stats — reading stats for the signed-in user
router.get('/', async (req, res) => {
  try {
    // When a valid token is present, scope the counts to that user.
    // Otherwise fall back to totals across all books so the widget still
    // renders something instead of erroring out.
    let scope = {};
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwtSecret);
        scope = { userId: decoded.sub };
      } catch (err) {
        scope = {};
      }
    }

    const [total, reading, finished, want, favorites] = await Promise.all([
      Book.countDocuments({ ...scope }),
      Book.countDocuments({ ...scope, status: 'reading' }),
      Book.countDocuments({ ...scope, status: 'finished' }),
      Book.countDocuments({ ...scope, status: 'want' }),
      Book.countDocuments({ ...scope, favorite: true }),
    ]);

    return res.json({ total, reading, finished, want, favorites });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
