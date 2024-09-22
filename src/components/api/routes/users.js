const express = require('express')
const router = express.Router()
const conn = require('../db')


//create owner
router.post('/users', (req, res) => {
    const { user_id, user_password, user_fname, user_lname, user_tel, user_id_card, role_type, user_status } = req.body
    const sql = 'INSERT INTO user_account (user_id, user_password, user_fname, user_lname, user_tel, user_id_card, role_type, user_status ) VALUES (?,?,?,?,?,?,?,?)'
    const values = [user_id, user_password, user_fname, user_lname, user_tel, user_id_card, role_type, user_status];
    console.log(req.body)
    conn.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            if (results.affectedRows > 0) {
                res.status(201).json({
                    message: 'add owner success'
                    // , productId: results[0]
                });
            } else {
                res.status(404).json({ message: 'new owners not found' });

            }

        }
    })
})

router.put('/users/:id', (req, res) => {
    const { user_id, user_password, user_fname, user_lname, user_tel, user_id_card, role_type, user_status } = req.body
    const sql = 'UPDATE user_account SET user_password = ?, user_fname = ? , user_lname = ?, user_tel = ? ,user_id_card = ? ,role_type = ? ,user_status = ? WHERE user_id = ?'
    const values = [user_password, user_fname, user_lname, user_tel, user_id_card, role_type, user_status, user_id];
    conn.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Update owner success' });
            } else {
                res.status(404).json({ message: 'owner not found' });
            }
        }
    })
})

router.delete('/users/:id', (req, res) => {
    const { id } = req.params
    const sql = 'DELETE FROM user_account WHERE user_id = ? '
    const value = [id]
    conn.query(sql, value, (error, results) => {
        if (error) {
            res.status(500).json({ error });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Update success' });
            } else {
                res.status(404).json({ message: 'Owners not found' });
            }
        }
    })
})


module.exports = router