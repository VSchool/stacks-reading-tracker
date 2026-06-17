/*
 * Seed script. Wipes the users + books collections and inserts a small,
 * known data set for local development and demos.
 *
 * Run with: npm run seed
 */
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Book = require('./models/Book');

// All seeded accounts share this password for convenience in dev.
const DEFAULT_PASSWORD = process.env.SEED_PASSWORD || 'stacks1234';

const USERS = [
  { email: 'quinn@stacks.test', name: 'Quinn Adler' },   // intentionally has NO books
  { email: 'ada@stacks.test', name: 'Ada Okafor' },
  { email: 'ben@stacks.test', name: 'Ben Castillo' },
];

// Books for Ada and Ben — keyed by email.
const BOOKS = {
  'ada@stacks.test': [
    { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', status: 'finished', rating: 5, favorite: true },
    { title: 'Project Hail Mary', author: 'Andy Weir', status: 'reading', rating: 4, favorite: false },
    { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', status: 'finished', rating: 4, favorite: true },
    { title: 'A Memory Called Empire', author: 'Arkady Martine', status: 'want', rating: 0, favorite: false },
    { title: 'The Fifth Season', author: 'N. K. Jemisin', status: 'reading', rating: 5, favorite: true },
  ],
  'ben@stacks.test': [
    { title: 'Dune', author: 'Frank Herbert', status: 'finished', rating: 5, favorite: true },
    { title: 'Piranesi', author: 'Susanna Clarke', status: 'finished', rating: 5, favorite: false },
    { title: 'The Three-Body Problem', author: 'Liu Cixin', status: 'want', rating: 0, favorite: false },
    { title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', status: 'reading', rating: 4, favorite: true },
  ],
};

async function seed() {
  await connectDB();

  await User.deleteMany({});
  await Book.deleteMany({});

  const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const idByEmail = {};

  for (const u of USERS) {
    const user = await User.create({ email: u.email, name: u.name, password: hashed });
    idByEmail[u.email] = user._id;
  }

  for (const [email, books] of Object.entries(BOOKS)) {
    const userId = idByEmail[email];
    await Book.insertMany(books.map((b) => ({ ...b, userId })));
  }

  console.log('Seed complete:');
  for (const u of USERS) {
    const count = await Book.countDocuments({ userId: idByEmail[u.email] });
    console.log(`  ${u.email} (${u.name}) — ${count} book(s)`);
  }
  console.log(`All accounts use password: ${DEFAULT_PASSWORD}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
