// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const path = require('path');

const app = express();
// const PORT = 5000;

const CLIENT_URL = process.env.CLIENT_URL || 'https://userchattingapp.netlify.app';

app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:3000'], // Allow both Netlify and local development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.use(express.json());
// app.use(express.json()); 

// Connect to SQLite database
const dbPath = process.env.DB_PATH || './database.db';
console.log('Attempting to connect to database at:', dbPath);

const db = new sqlite3.Database( dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

const SECRET_KEY = process.env.JWT_SECRET || 'App@2014!!';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
}
// Endpoint to handle login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
console.log('Received login request for email:', email)
  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    console.log('User found:', user ? 'Yes' : 'No')
    if (!user) {
      console.log('User not found for email:', email);

      return res.status(404).json({ error: 'User not found' });
    }
    console.log('Comparing passwords');

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch ? 'Yes' : 'No');

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, username: user.username } });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Allowed origins: ${CLIENT_URL}, http://localhost:3000`);
  console.log(`Database path: ${dbPath}`);
});