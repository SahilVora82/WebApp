const express = require('express');
const router = express.Router();
const connection = require('../db');


function isAuthenticated(req, res, next) {
    if (req.session.user && req.session.user.isLoggedIn) {
        console.log("already logged in");
        return next(); // Continue if the user is authenticated
    } else {
        res.status(401).send('Unauthorized: Please log in');
    }
}

router.post('/request', isAuthenticated, (req, res) => {
    console.log(req.body);
    console.log(req.session);
    req.body.username = req.session.user.username;
    const { username, request, location } = req.body; // Ensure these match the form names
    const query = 'INSERT INTO requests (username, request, location) VALUES (?, ?, ?)';

    connection.query(query, [username, request, location], (err, results) => {
        if (err) {
            console.error('Error inserting request into the database:', err);
            res.status(500).send('Error inserting request into the database');
            return;
        }
        console.log('Request successfully added');
        res.redirect('/Dashboard.html');
    });
});

router.get('/get-requests', isAuthenticated, (req, res) => {
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

router.get('/location', (req, res) => {
    const query = 'SELECT * FROM requests';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving requests from the database:', err);
            res.status(500).json({ error: 'Error retrieving requests from the database' });
            return;
        }
        res.json(results);
    });
});


module.exports = router;


