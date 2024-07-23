const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.resolve(__dirname, 'database.db');

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
      } else {
        console.log('Connected to SQLite database');
        db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE,
          username TEXT,
          password TEXT
        )`, (err) => {
          if (err) {
            console.error('Error creating users table:', err.message);
            reject(err);
          } else {
            console.log('Users table created or already exists');
            resolve(db);
          }
        });
      }
    });
  });
}

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request for email:', email);

  app.locals.db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error('Database error during login:', err.message);
      return res.status(500).json({ error: 'Internal server error', details: err.message });
    }
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
      console.error('Error during password comparison:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
});

// Registration route
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    app.locals.db.run('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', 
      [email, username, hashedPassword], 
      function(err) {
        if (err) {
          console.error('Error registering new user:', err.message);
          return res.status(500).json({ error: 'Error registering new user', details: err.message });
        }
        res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
      }
    );
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Function to add a test user
function addTestUser() {
  const testEmail = 'test@example.com';
  const testUsername = 'testuser';
  const testPassword = 'password123';

  bcrypt.hash(testPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing test password:', err);
      return;
    }

    app.locals.db.run('INSERT OR IGNORE INTO users (email, username, password) VALUES (?, ?, ?)', 
      [testEmail, testUsername, hashedPassword], 
      function(err) {
        if (err) {
          console.error('Error inserting test user:', err.message);
        } else {
          console.log('Test user inserted or already exists');
        }
      }
    );
  });
}

// Initialize database and start server
initializeDatabase()
  .then((db) => {
    app.locals.db = db;
    addTestUser();
    
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
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