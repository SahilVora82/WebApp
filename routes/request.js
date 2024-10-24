const express = require('express');
const router = express.Router();
const connection = require('../db');


function isAuthenticated(req, res, next) {
    if (req.session.user && req.session.user.isLoggedIn) {
        console.log("already logged in");
        return next();
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
    const query = 'SELECT username, request, location, requester_name, accepted, delivered, numberID FROM requests';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving requests from the database:', err);
            res.status(500).send('Error retrieving requests from the database');
            return;
        }

        res.json({
            boxes: results,
            loggedInUsername: req.session.user.username
        });
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


router.post('/deliver', isAuthenticated, (req, res) => {
    const numberID = req.body.numberID;

    const query = 'UPDATE requests SET delivered = "yes" WHERE numberID = ?';

    connection.query(query, [numberID], (err, results) => {
        if (err) {
            console.error('Error marking request as delivered:', err);
            res.status(500).send('Error marking request as delivered');
            return;
        }

        console.log('Request marked as delivered');
        res.redirect('/Dashboard.html');
    });
});





module.exports = router;
