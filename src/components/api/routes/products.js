const express = require('express');
const router = express.Router();
const conn = require('../db'); // Import the connection from db.js


//read products
router.get('/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    conn.query(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            res.json(results);
        }
    });
});

//create products
router.post('/products', (req, res) => {
    const { p_id, p_name, p_price, p_type, category_id } = req.body
    const sql = `INSERT INTO products (p_id,p_name,p_price,p_type,category_id) VALUES (?,?,?,?,?)`
    const values = [p_id, p_name, p_price, p_type, category_id];
    console.log(req.body)
    conn.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            res.status(201).json({ message: 'เพิ่มสินค้าสำเร็จ', productId: results.insertId });
        }
    });
})

//update products
router.put('/products/:id', (req, res) => {
    res.send('put 11products')
})

router.delete('/products/:id', (req, res) => {
    res.send('delete products')
})


module.exports = router;
