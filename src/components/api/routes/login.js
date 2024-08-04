const express = require('express');
const router = express.Router();
const conn = require('../db');
const jwt = require('jsonwebtoken');
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
                const userData = results[0]
                const payload = {
                    user_id: userData.user_id,
                    user_password: userData.user_password,
                    user_fname: userData.user_fname,
                    user_lname: userData.user_lname,
                    user_tel: userData.user_tel,
                    user_id_card: userData.user_id_card,
                    role_type: userData.role_type,
                    user_status: userData.user_status,
                }
                const token = jwt.sign(payload, jwtKey, { expiresIn: '1h' });
                res.header("authorization", token).json({ token: token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        }
    })
})

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization']
        if (!token) {
            return res.status(401).send('No token')
        }
        jwt.verify(token, jwtKey, (error, decoded) => {
            if (error) {
                return res.status(403).json({ message: 'Failed to authenticate token' });
            }
            req.user = decoded;

            next()
        })
    } catch (error) {
        console.log(error)
        res.send('Token Invalid').status(500)
    }
}

const checkUser = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]
        if (!token) {
            return res.status(401).send('check No token')
        }
        const decoded = jwt.verify(token, jwtKey)
        userData = decoded;
        if (userData) {
            res.send(userData)
        } else {
            res.status(403).send('Access denied' ); // ส่ง response กลับถ้าไม่ได้เป็น admin
        }
    } catch (error) {
        console.log(error)
        res.send('Token Invalid').status(500)
    }
}

router.get('/protected', verifyToken, checkUser)



module.exports = router