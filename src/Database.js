let mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    database: 'tidskapslen_database',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    multipleStatements: true
})

module.exports = pool

