
const conn = require('../db')
const moment = require('moment-timezone');

exports.showOrderIs = (req, res) => {

    const sqlSeleteOrderId = `  SELECT order_id FROM orders  `

    conn.query(sqlSeleteOrderId, (error, result) => {
        if (error) {
            res.status(400).json({ error })
        }
        else {
            res.json(result)
        }
    })
}

exports.reprintReceipt = (req, res) => {
    const { order_id } = req.params
    const sqlSeleteReceipt = `
                                SELECT orders.order_id, 
                                orders.order_no, 
                                orders.order_date_time, 
                                orders.payment_type, 
                                orders.user_id, 
                                orders.c_id, 
                                order_detail.order_detail_id, 
                                order_detail.p_id, 
                                products.p_name, 
                                order_detail.quantity, 
                                order_detail.price
                                FROM orders
                                LEFT JOIN order_detail ON orders.order_id = order_detail.order_id
                                LEFT JOIN products ON order_detail.p_id = products.p_id 
                                WHERE orders.order_id = ?
                                `
    const value = [order_id]
    conn.query(sqlSeleteReceipt, value, (error, result) => {
        if (error) {
            res.status(400).json({ error })
        }
        else {
            res.json(result)
        }
    })







}