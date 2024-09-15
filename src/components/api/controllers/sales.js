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



exports.readMonthly = (req, res) => {
    const sqlMonthly = `
                        SELECT SUM(order_detail.price) AS total_price, DATE_FORMAT(orders.order_date_time, '%Y-%m') AS monthly
                        FROM order_detail
                        JOIN orders
                        ON order_detail.order_id = orders.order_id
                        GROUP BY monthly
                        ORDER BY monthly;
                      `

    conn.query(sqlMonthly, (error, results) => {
        if (error) {
            res.status(400).json({ error })
        }
        else {
            res.json(results)
        }

    })
}