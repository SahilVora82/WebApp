const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'database-4.ct64se8ooimh.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'CongApp1!',
    database: 'usersData'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

module.exports = connection;


