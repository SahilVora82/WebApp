const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error inserting user into the database:', err);
            res.status(500).send('Error inserting user into the database');
            return;
        }
        res.send('User successfully signed up');
    });
});

module.exports = router;
