const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post('/request', (req, res) => {
    console.log(req.body);
    const { username, request } = req.body; // Ensure these match the form names
    const query = 'INSERT INTO requests (username, request) VALUES (?, ?)';

    connection.query(query, [username, request], (err, results) => {
        if (err) {
            console.error('Error inserting request into the database:', err);
            res.status(500).send('Error inserting request into the database');
            return;
        }
        console.log('Request successfully added');
        res.redirect('/Testing.HTML');
    });
});

router.get('/get-requests', (req, res) => {
    const query = 'SELECT * FROM requests';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving requests from the database:', err);
            res.status(500).send('Error retrieving requests from the database');
            return;
        }
        // Send the retrieved data as JSON to the client
        res.json(results);
    });
});

module.exports = router;
