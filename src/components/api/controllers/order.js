const conn = require('../db')

exports.read = async(req,res) =>{
    const sql = 'SELECT * FROM orders'
    conn.query(sql, (error, results) => {
        if (error) {
            res.status(500).json({ error })
        }
        else {
            res.json(results)
        }
    })
}