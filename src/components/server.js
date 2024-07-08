const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

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
    } else {
        console.log('MySQL Connected');
    }
});

app.post('/login', (req, res) => {
    const { user_id, password } = req.body;
    const sql = 'SELECT user_account FROM kathongpos WHERE user_id = ? AND password = ?';
    conn.query(sql, [user_id, password], (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else if (results.length > 0) {
            const token = 'your-jwt-token';
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
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

// conn.connect(function (error) {
//     if (error) {
//         console.log(error)
//         conn.query('SELECT * FROM user_account', function (error, results, field) {
//             if (error) {
//                 console.log(results)
//             }
//         })
//     }
// })


app.listen(3000, () => {
    console.log('Server started on port 3000');

});
