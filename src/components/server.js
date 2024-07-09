const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
var jwt = require('jsonwebtoken')
// const bodyParser = require('body-parser');



const app = express();
app.use(cors());
app.use(express.json());

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kathongpos'
});

conn.connect((error) => {
    if (error) {
        console.log(error);
        return
    } else {
        console.log('MySQL Connected');
    }
});


app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM user_account';
    conn.query(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            res.json(results);
        }
    });
});


const jwtKey = 'your_jwt_token';


app.post('/login', (req, res) => {
    conn.query(
        'SELECT * FROM user_account WHERE user_id=? AND user_password=?',
        [req.body.user_id, req.body.user_password],
        function (error, results, fields) {
            if (error) {
                res.status(500).json({ status: 'error', message: error });
                return;
            }
            if (results.length === 0) {
                res.status(401).json({ status: 'error', message: 'no user found' });
                return;
            }
            // var token = jwt.sign({ user_id }, jwtKey, { expiresIn: '1h' })
            res.json({ status: 'login successfuly' });
        }
    );
});





app.listen(3000, () => {
    console.log('Server started on port 3000');

});
