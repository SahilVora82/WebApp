
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const connection = require('../db');

router.post('/signup', (req, res) => {
    console.log('Signup request received:', req.body);
    const { username, password, location } = req.body;
    const checkUserInput = 'SELECT * FROM users WHERE username = ?';
    const query = 'INSERT INTO users (username, password, location) VALUES (?, ?, ?)';

    connection.query(checkUserInput, [username], (err, results) => {
        if (err) {
            console.error('Error checking for existing user:', err);
            res.status(500).send('Error checking for existing user');
            return;
        }

        if (results.length > 0) {
            console.log('Username already exists');
            res.redirect('/signupError.html');
            return;
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                res.status(500).send('Error hashing password');
                return;
            }

            console.log('Hashed password:', hashedPassword);

            connection.query(query, [username, hashedPassword, location], (err, results) => {
                if (err) {
                    console.error('Error inserting user into the database:', err);
                    res.status(500).send('Error inserting user into the database');
                    return;
                }

                req.session.user = {
                    username: username,
                    isLoggedIn: true
                };
                console.log('User successfully signed up and logged in');
                res.redirect('/LandingPage.html');
            });
        });
    });
});

module.exports = router;


router.post('/login', async (req, res) => {
    console.log('login code');
    console.log(req.body);
    const { username, password } = req.body;

    const query = 'SELECT password FROM users WHERE username = ?';

    connection.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error querying user into the database:', err);
            res.status(500).send('Database error');
            return;
        }

        if (results.length > 0) {
            const hashedPassword = results[0].password;

            const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

            if (isPasswordMatch) {
                req.session.user = {
                    username: username,
                    isLoggedIn: true
                };
                console.log('User successfully logged in');
                res.redirect('/LandingPage.html');
            } else {
                console.log('Password did not match');
                res.redirect('/LoginError.html');
            }
        } else {
            console.log('User not found');
            res.redirect('/LoginError.html');
        }
    });
});

module.exports = router;