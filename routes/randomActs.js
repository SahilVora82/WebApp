const express = require('express');
const router = express.Router();
const connection = require('../db');

// Route to get a random act of kindness
router.get('/random-act', (req, res) => {
    const query = 'SELECT kindness_message AS message FROM random_acts ORDER BY RAND() LIMIT 1';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching random act:', err);
            return res.status(500).send('Error fetching random act');
        }

        console.log('Query result:', results); // Add this line to check the output

        res.json({ message: results.length > 0 ? results[0].message : 'Be kind today!' });
    });
});

module.exports = router;
