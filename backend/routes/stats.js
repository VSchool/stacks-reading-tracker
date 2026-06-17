const express = require('express');
const jwt = require('jsonwebtoken');
const Book = require('../models/Book');
const config = require('../config/config');

const router = express.Router();

// GET /stats — reading stats for the signed-in user
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    const userId = decoded.id;

    const [total, reading, finished, want, favorites] = await Promise.all([
      Book.countDocuments({ userId }),
      Book.countDocuments({ userId, status: 'reading' }),
      Book.countDocuments({ userId, status: 'finished' }),
      Book.countDocuments({ userId, status: 'want' }),
      Book.countDocuments({ userId, favorite: true }),
    ]);

    return res.json({ total, reading, finished, want, favorites });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
