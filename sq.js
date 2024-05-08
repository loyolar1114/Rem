
const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const router = express.Router();

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Onepiece123',
  database: 'hello_world_db'
});

// Handle POST request to /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query database for hashed password
  connection.query('SELECT password FROM users WHERE username = ?', [username], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length === 0) {
      res.status(401).send('Invalid username or password');
      return;
    }

    const hashedPassword = results[0].password;

    // Compare hashed password with user input
    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      if (result) {
        // Passwords match, authentication successful
        req.session.username = username; // Set up session
        res.redirect('/welcome'); // Redirect to authenticated page
      } else {
        // Passwords don't match, authentication failed
        res.status(401).send('Invalid username or password');
      }
    });
  });
});

module.exports = router;