const express = require('express');
const router = express.Router();
const conn = require('../db');
const jwt = require('jsonwebtoken');
const { route } = require('./products');
const jwtKey = 'your_jwt_token';


router.get('/users', (req, res) => {
    const sql = 'SELECT * FROM user_account'
    conn.query(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            res.json(results);
        }
    })
})

router.post('/users/login', (req, res) => {
    // res.send('login')
    const { user_id, user_password } = req.body
    const sql = 'SELECT * FROM user_account WHERE user_id = ? AND user_password = ?';
    const value = [user_id, user_password];
    console.log(req.body)
    conn.query(sql, value, (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            if (results.length > 0) {
                const token = jwt.sign({ user_id: results[0].user_id }, jwtKey, { expiresIn: '1h' });
                res.status(201).json({
                    message: 'Login success',
                    user: results[0],
                    token
                });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        }
    })
})

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.status(401), json({
            status: 'error', message: 'no token'
        })
    }
    jwt.verify(token, jwtKey, (error, decoded) => {
        if (error) {
            return res.status(403).json({
                status: 'error', message: 'failed to authrntichate token'
            })
        }
        req.user_id = decoded.user_id
        next()
    })
}

router.get('/protected', verifyToken, (req, res) => {
    res.json({
        status: 'ok', message: 'have token'
    })
})



module.exports = router