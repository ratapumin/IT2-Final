

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



exports.createMembers = async (req, res) => {
    const { c_tel, c_fname, c_lname, c_points, c_status } = req.body
    const sqlInsert = `INSERT INTO customers(c_tel,c_fname,c_lname,c_points,c_status) VALUES (?,?,?,?,?)`
    const values = [c_tel, c_fname, c_lname, c_points, c_status]
    console.log(req.body)
    conn.query(sqlInsert, values, (error, results) => {
        if (error) {
            res.status(500).json({ error })
        } else {
            res.status(201).json({ message: 'Insert Customer Success', customerId: results.insertId })
        }
    })
}

exports.updateMembers = async (req, res) => {
    const { c_tel, c_fname, c_lname } = req.body
    const c_id = req.params.id
    const sqlUpdate = `UPDATE customers SET c_tel = ?, c_fname = ?, c_lname = ? WHERE c_id  = ?`
    const values = [c_tel, c_fname, c_lname, c_id]
    console.log(req.body)
    conn.query(sqlUpdate, values, (error, results) => {
        if (error) {
            res.status(500).json({ error })
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Update success' });
            } else {
                res.status(404).json({ message: 'Member not found' });
            }
        }
    })



}


exports.deleteMembers = async (req, res) => {
    const { id } = req.params
    const sql = 'DELETE FROM customers WHERE c_id = ?'
    const value = [id]

    conn.query(sql, value, (error, results) => {
        if (error) {
            res.status(500).json({ error })
        } else {
            if (results.affectedRows > 0) {
                res.status(201).json({ message: 'Delete success' })
            } else {
                res.status(404).json({ message: 'Member not found' });

            }
        }

    })
}