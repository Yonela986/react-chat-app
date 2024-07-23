const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || 'https://userchattingapp.netlify.app';

app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Something went wrong!',
    details: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

app.use(express.json());

// Connect to SQLite database
const dbPath = path.resolve(__dirname, process.env.DB_PATH || './database.db');
console.log('Attempting to connect to database at:', dbPath);

// Check if database file exists, if not create it
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
  console.log('Created new database file');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    console.error('Full error object:', err);
  } else {
    console.log('Connected to SQLite database');
    
    // Create users table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      username TEXT,
      password TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
      } else {
        console.log('Users table created or already exists');
      }
    });
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
    console.error('Full error object:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Allowed origins: ${CLIENT_URL}, http://localhost:3000`);
  console.log(`Database path: ${dbPath}`);
});



// // server.js
// const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// // const path = require('path');

// const app = express();
// // const PORT = 5000;

// const CLIENT_URL = process.env.CLIENT_URL || 'https://userchattingapp.netlify.app';

// app.use(cors({
//   origin: [CLIENT_URL, 'http://localhost:3000'], // Allow both Netlify and local development
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).json({
//     error: 'Something went wrong!',
//     details: err.message,
//     stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
//   });
// });

// app.use(express.json());
// // app.use(express.json()); 

// // Connect to SQLite database
// const dbPath = process.env.DB_PATH || './database.db';
// console.log('Attempting to connect to database at:', dbPath);

// const db = new sqlite3.Database( dbPath, (err) => {
//   if (err) {
//     console.error('Error opening database:', err.message);
//     console.error('Full error object:', err);
//   } else {
//     console.log('Connected to SQLite database');
//     // Test the connection with a simple query
//     db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
//       if (err) {
//         console.error('Error querying database:', err);
//       } else if (row) {
//         console.log('Users table exists');
//       } else {
//         console.log('Users table does not exist');
//       }
//     });
//   }
// });

// const SECRET_KEY = process.env.JWT_SECRET || 'App@2014!!';

// const generateToken = (user) => {
//   return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
// }
// // Endpoint to handle login
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
// console.log('Received login request for email:', email)
//   try {
//     const user = await new Promise((resolve, reject) => {
//       db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
//         if (err) reject(err);
//         else resolve(row);
//       });
//     });
//     console.log('User found:', user ? 'Yes' : 'No')
//     if (!user) {
//       console.log('User not found for email:', email);

//       return res.status(404).json({ error: 'User not found' });
//     }
//     console.log('Comparing passwords');

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     console.log('Password match:', passwordMatch ? 'Yes' : 'No');

//     if (!passwordMatch) {
//       return res.status(401).json({ error: 'Invalid password' });
//     }

//     const token = generateToken(user);
//     res.json({ token, user: { id: user.id, username: user.username } });

//   } catch (error) {
//     console.error('Login error:', error);
//     console.error('Full error object:', error);
//     res.status(500).json({ error: 'Internal server error', details: error.message });
//   }
// });

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
//   console.log(`Allowed origins: ${CLIENT_URL}, http://localhost:3000`);
//   console.log(`Database path: ${dbPath}`);
// });