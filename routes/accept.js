const express = require('express');
const router = express.Router();
const connection = require('../db');
const bcrypt = require('bcrypt');


router.post('/accept', (req, res) => {
    const username = req.session.user.username;
    const numberID = req.body.numberID;

    const query = 'UPDATE requests SET requester_name = ?, accepted = "yes" WHERE numberID = ?';

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

    connection.query('SELECT requester_name FROM requests WHERE numberID = ?', [numberID], (err, results) => {
        if (err) {
            console.error('Error fetching requester name from the database:', err);
            res.status(500).send('Database error');
            return;
        }

        if (results.length > 0 && results[0].requester_name === username) {
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
            res.status(403).send('Not authorized to decline this request');
        }
    });
});




module.exports = router;
