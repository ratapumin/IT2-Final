// const express = require('express')
// const router = express.Router()
const conn = require('../db')

exports.list = async (req, res) => {
    const sql = 'SELECT * FROM customers'
    conn.query(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error })
        }
        else {
            res.json(results)
        }
    })
}

