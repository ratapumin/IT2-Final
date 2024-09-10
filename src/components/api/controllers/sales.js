const conn = require('../db')

exports.readSales = (req, res) => {

    const sqlPrice = ` SELECT SUM(order_detail.price), orders.payment_type 
                        FROM order_detail 
                        JOIN orders
                        ON order_detail.order_id = orders.order_id
                        GROUP BY orders.payment_type;
                     `

    conn.query(sqlPrice, (error, results) => {
        if (error) {
            res.status(400).json({ error })
        }
        else {
            res.json(results)
        }
    })
}