const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kathongpos'
});

conn.connect((error) => {
    if (error) {
        console.log(error);
        return;
    } else {
        console.log('MySQL Connected');
    }
});

module.exports = conn;
