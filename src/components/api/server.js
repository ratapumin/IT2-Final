const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const conn = require('./db')
const app = express();
const productRoutes = require('./routes/products');


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
            const user = results[0];
            const token = jwt.sign({ results }, jwtKey, { expiresIn: '1h' });
            res.json({
                status: 'login successfully', token, user: {
                    user_fname: user.user_fname,
                    user_lname: user.user_lname,
                    user_tel: user.user_tel
                }
            });
        }
    );
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({
            status: 'error', message: 'No token provided'
        });
    }
    jwt.verify(token, jwtKey, (error, decoded) => {
        if (error) {
            return res.status(500).json({
                status: 'error', message: 'Failed to authenticate token'
            });
        }
        req.user_id = decoded.user_id;
        next();
    });
};

app.get('/api/protected', verifyToken, (req, res) => {
    res.json({
        status: 'ok', message: 'This is a protected route', user_id: req.user_id
    });
});


app.use(cors());
app.use(express.json()); 
app.use('/api', productRoutes);

app.listen(5000, () => {
    console.log('Server started on port 5000');
});
