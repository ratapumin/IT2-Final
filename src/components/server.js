const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const { useEffect } = require('react');
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


app.get('/api/users', (req, res) => {
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


app.post('/api/login', (req, res) => {
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
            const user = results[0]
            const token = jwt.sign({ results }, jwtKey, { expiresIn: '1h' })
            res.json({
                status: 'login successfuly', token, user: {
                    user_fname: user.user_fname,
                    user_lname: user.user_lname,
                    user_tel: user.user_tel
                }
            });

        }
    );
});


const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.status(403).json({
            status: 'error', message: 'No token provided'
        })
    }
    jwt.verify(token, jwtKey, (error, decoded) => {
        if (error) {
            return res.status(500).json({
                status: 'error', message: 'Failed to authenticate token'
            })
        }
        req.user_id = decoded.user_id;
        next(); ำ
    })
}

app.get('/api/protected', verifyToken, (req, res) => {
    res.json({
        status: 'ok', message: 'This is a protectted route', user_id: req.user_id
    })
})


app.get('/api/products', (req, res) => {

    const sql = 'SELECT * FROM products';
    conn.query(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error });    
        } else {
            res.json(results);
        }
    });

})


app.listen(3333, () => {
    console.log('Server started on port 3333');

});
