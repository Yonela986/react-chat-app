// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'https://userchattingapp.netlify.app/login',
  methods: ['GET', 'POST'], // Add other methods as needed
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json()); 

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });
}
// Endpoint to handle login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
console.log('Received login request:', req.body)
  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], async (err, user) => {
      if (err) {
        console.error('Error retrieving user:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Generate JWT token
      const token = generateToken(user);
      res.json({ token, user: { id: user.id, username: user.username } });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});