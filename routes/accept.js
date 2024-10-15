const express = require('express');
const router = express.Router();
const connection = require('../db');
const bcrypt = require('bcrypt');


router.post('/accept', (req, res) => {
    const username = req.session.user.username; // This is the username of the person accepting the request
    const numberID = req.body.numberID; // The numberID of the request being accepted

    // Update the 'requests' table by setting 'requester_name' to the username of the person who accepted the request
    const query = 'UPDATE requests SET requester_name = ?, accepted = "yes" WHERE numberID = ?';

    // Execute the query
    connection.query(query, [username, numberID], (err, results) => {
        if (err) {
            console.error('Error updating request in the database:', err);
            res.status(500).send('Error updating request in the database');
            return;
        }
        console.log('Request successfully accepted');
        res.redirect('/Dashboard.html');
    });
});



router.post('/decline', (req, res) => {
    const username = req.session.user.username;
    const numberID = req.body.numberID;

    // Check if the logged-in user accepted the request
    connection.query('SELECT requester_name FROM requests WHERE numberID = ?', [numberID], (err, results) => {
        if (err) {
            console.error('Error fetching requester name from the database:', err);
            res.status(500).send('Database error');
            return;
        }

        if (results.length > 0 && results[0].requester_name === username) {
            // Proceed with decline if the user matches
            const query = 'UPDATE requests SET requester_name = NULL, accepted = "no" WHERE numberID = ?';
            connection.query(query, [numberID], (err, results) => {
                if (err) {
                    console.error('Error updating request in the database:', err);
                    res.status(500).send('Error updating request in the database');
                    return;
                }
                console.log('Request successfully declined');
                res.redirect('/Dashboard.html');
            });
        } else {
            // Do not allow decline if the user didn't accept the request
            res.status(403).send('Not authorized to decline this request');
        }
    });
});




module.exports = router;
