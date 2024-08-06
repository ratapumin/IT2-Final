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
    const { p_id, p_name, p_price, p_type, category } = req.body
    const sql = `INSERT INTO products (p_id,p_name,p_price,p_type,category) VALUES (?,?,?,?,?)`
    const values = [p_id, p_name, p_price, p_type, category];
    console.log(req.body)
    conn.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            res.status(201).json({ message: 'add product success', productId: results.insertId });
        }
    });
})

//update products
router.put('/products/:id', (req, res) => {
    const { p_id, p_name, p_price, p_type, category } = req.body
    const sql = 'UPDATE products SET p_name = ?, p_price = ? , p_type = ?, category = ? WHERE p_id = ?'
    const values = [p_name, p_price, p_type, category, p_id];
    conn.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Update success' });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        }
    });
})


router.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE p_id=?'
    const value = [id]
    conn.query(sql, value, (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Update success' });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        }
    })

})


module.exports = router;
