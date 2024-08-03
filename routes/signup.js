const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post('/signup', (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error inserting user into the database:', err);
            res.status(500).send('Error inserting user into the database');
            return;
        }
        console.log('User successfully signed up');
        res.redirect('/Testing.HTML');
    });
});

module.exports = router;
