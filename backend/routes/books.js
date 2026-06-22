const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

const STATUSES = ['reading', 'finished', 'want'];

// Validate the body of a create/update. Returns an error string, or null if OK.
function validateBook(body) {
  const { title, author, status, rating } = body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return 'title is required';
  }
  if (!author || typeof author !== 'string' || !author.trim()) {
    return 'author is required';
  }
  if (status !== undefined && !STATUSES.includes(status)) {
    return `status must be one of: ${STATUSES.join(', ')}`;
  }
  if (rating !== undefined) {
    if (typeof rating !== 'number' || Number.isNaN(rating)) {
      return 'rating must be a number';
    }
    if (rating < 0 || rating > 5) {
      return 'rating must be between 0 and 5';
    }
  }
  return null;
}

// GET /books — list the signed-in user's books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json(books);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET /books/search?q= — look up books from the Open Library catalog
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    if (!q) {
      return res.json([]);
    }

    const url =
      'https://openlibrary.org/search.json?limit=10' +
      '&fields=title,author_name,first_publish_year,cover_i' +
      '&q=' + encodeURIComponent(q);
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(502).json({ error: 'Book lookup is unavailable' });
    }

    const data = await response.json();
    const results = (data.docs || []).map((d) => ({
      title: d.title || 'Untitled',
      author: Array.isArray(d.author_name) ? d.author_name[0] : 'Unknown',
      year: d.first_publish_year || null,
      coverUrl: d.cover_i
        ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
        : '',
    }));

    return res.json(results);
  } catch (err) {
    return res.status(502).json({ error: 'Book lookup is unavailable' });
  }
});

// GET /books/:id — fetch a single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    return res.json(book);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST /books — create a book
router.post('/', async (req, res) => {
  try {
    const problem = validateBook(req.body);
    if (problem) {
      return res.status(400).json({ error: problem });
    }

    const { title, author, status, rating, favorite, coverUrl } = req.body;
    const book = await Book.create({
      title,
      author,
      status,
      rating,
      favorite,
      coverUrl,
      userId: req.user._id,
    });

    return res.status(201).json(book);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// PUT /books/:id — update a book the user owns
router.put('/:id', async (req, res) => {
  try {
    const problem = validateBook(req.body);
    if (problem) {
      return res.status(400).json({ error: problem });
    }

    const book = await Book.findOne({ _id: req.params.id, userId: req.user._id });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const { title, author, status, rating, favorite } = req.body;
    book.title = title;
    book.author = author;
    if (status !== undefined) book.status = status;
    if (rating !== undefined) book.rating = rating;
    if (favorite !== undefined) book.favorite = favorite;
    await book.save();

    return res.json(book);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// DELETE /books/:id — remove a book the user owns
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    return res.json({ message: 'Book deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
