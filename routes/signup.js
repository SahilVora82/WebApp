const nodemailer = require('nodemailer'); // Import nodemailer
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const connection = require('../db');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'networkneighborly@gmail.com', // Replace with your email
        pass: 'xeudutnqlwskhbfs'    // Replace with your app-specific password
    }
});


function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}



async function geoCodeAddress(address) {
    const geoCodeApiKey = 'pk.4e7d542fb27c753e173543c95bf667e6';
    const url = `https://us1.locationiq.com/v1/search.php?key=${geoCodeApiKey}&q=${encodeURIComponent(address)}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            const location = data[0];
            const lat = location.lat;
            const lon = location.lon;
            return `${lat},${lon}`; // Return as "latitude,longitude"
        } else {
            throw new Error('No results found for the address');
        }
    } catch (error) {
        console.error('Error geocoding the address:', error);
        throw new Error('Geocoding failed');
    }
}

// Update the signup route
router.post('/signup', async (req, res) => {
    try {
        console.log('Signup request received:', req.body);
        const { username, password, location: rawLocation, email } = req.body;

        // Geocode the location
        const locationgeo = await geoCodeAddress(rawLocation); // Wait for geocoding
        console.log(locationgeo)
        console.log('Signup parameters:', username, password, location, email);

        const checkUserInput = 'SELECT * FROM users WHERE username = ?';
        const query = 'INSERT INTO users (username, password, location, email, verification_token) VALUES (?, ?, ?, ?, ?)';
        const verification_token = Math.floor(100000 + Math.random() * 900000);

        // Check if username exists
        connection.query(checkUserInput, [username], async (err, results) => {
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

            // Hash the password
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    res.status(500).send('Error hashing password');
                    return;
                }

                console.log('Hashed password:', hashedPassword);

                // Insert user into the database
                connection.query(query, [username, hashedPassword, location, email, verification_token], (err, results) => {
                    if (err) {
                        console.error('Error inserting user into the database:', err);
                        res.status(500).send('Error inserting user into the database');
                        return;
                    }

                    // Send the verification email
                    const mailOptions = {
                        from: '"Neighborly Network" <networkneighborly@gmail.com>',
                        to: email,
                        subject: 'Verify Your Email',
                        html: `
                            <p>Welcome to Neighborly Network!</p>
                            <p>Please verify your email by clicking the link below:</p>
                           <h1>${verification_token}</h1>
                        `,
                    };

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.error('Error sending verification email:', err);
                            res.status(500).send('Error sending verification email');
                            return;
                        }

                        console.log('Verification email sent:', info.response);
                        res.redirect('/verificationPage.html');
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Error during signup');
    }
});


router.post('/login', async (req, res) => {
    console.log('Login attempt received:', req.body);
    const { username, password } = req.body;

    // Query to get the password and verification status for the given username
    const query = 'SELECT password, email_verified FROM users WHERE username = ?';

    connection.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error querying user from the database:', err);
            res.status(500).send('Database error');
            return;
        }

        if (results.length > 0) {
            const { password: hashedPassword, email_verified } = results[0];

            // Check if the account is verified
            if (email_verified !== 1) {
                console.log('User account is not verified');
                res.redirect('/AccountNotVerified.html'); // Redirect to an account verification error page
                return;
            }

            // Verify the password
            const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

            if (isPasswordMatch) {
                req.session.user = {
                    username: username,
                    isLoggedIn: true
                };
                console.log('User successfully logged in');
                res.redirect('/LandingPage.html'); // Redirect to the landing page
            } else {
                console.log('Password did not match');
                res.redirect('/LoginError.html'); // Redirect to login error page
            }
        } else {
            console.log('User not found');
            res.redirect('/LoginError.html'); // Redirect to login error page
        }
    });
});


module.exports = router;
