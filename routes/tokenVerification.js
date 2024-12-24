const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post('/tokenVerification', (req, res) => {
    const { verification_token } = req.body; // Retrieve the token from request body
    console.log(verification_token); // Log the verification token for debugging

    // Query to find the user with the provided token
    const query = 'SELECT * FROM users WHERE verification_token = ?';

    connection.query(query, [verification_token], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Server error');
            return;
        }

        if (results.length > 0) {
            // Token matched, update the user's status to "verified"
            const updateQuery = 'UPDATE users SET email_verified = 1 WHERE verification_token = ?';

            connection.query(updateQuery, [verification_token], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating user verification status:', updateErr);
                    res.status(500).send('Server error');
                    return;
                }

                console.log('User verified successfully');
                res.redirect('/LandingPage.html'); // Redirect to Landing Page
            });
        } else {
            console.log('Invalid verification token');
            res.redirect('/verificationError.html'); // Redirect to error page
        }
    });
});

module.exports = router;
