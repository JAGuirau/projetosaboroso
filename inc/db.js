const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'saboroso',
    user: 'user',
    password: 'user',
    multipleStatements: true
});

module.exports = connection;