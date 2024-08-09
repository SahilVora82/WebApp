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

router.post('/login', (req, res) => {
    console.log('login code');
    console.log(req.body);
    const { username, password } = req.body;

    const query = 'SELECT password FROM users WHERE username = ?';

      connection.query(query, [username], (err, results) => {
          if (err) {
              console.error('Error querying user into the database:', err);
              res.status(500).send('database error');
              return;
          }
          if (results.length > 0) {
              console.log('stored password - ' + results[0].password);

              if (password == results[0].password) {
                  console.log('User successfully signed up');
                  res.redirect('/Testing.HTML');
              } else {
                  res.redirect('/LoginError.html')
              }
          } else {
              res.redirect('/LoginError.html')
          }
      });
});



function alerting(){



}




module.exports = router;
