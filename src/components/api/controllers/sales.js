
const conn = require('../db')
const moment = require('moment-timezone');

const convertToBangkokTime = (date) => moment(date).tz('Asia/Bangkok').format('YYYY-MM-DD');
const convertToBangkokTimeforMonth = (date) => moment(date).tz('Asia/Bangkok').format('YYYY-MM');



exports.readTypeSales = (req, res) => {
    const { date } = req.params
    const sqlPaymentType = `
                            SELECT SUM(order_detail.price*order_detail.quantity) as total,orders.payment_type 
                            FROM order_detail
                            JOIN orders
                            ON order_detail.order_id = orders.order_id
                            WHERE DATE_FORMAT(orders.order_date_time,'%Y-%m-%d') = ?
                            GROUP BY orders.payment_type
                     `
    const value = [date]

    conn.query(sqlPaymentType, value, (error, results) => {
        if (error) {
            res.status(400).json({ error })
        }
        else {
            res.json(results)
        }
    })
}

exports.readOldGraphMonthly = (req, res) => {
    const sqlGraphMonthly = `
                    SELECT DATE_FORMAT(orders.order_date_time, '%Y-%m') AS monthly, 
                    SUM(order_detail.price * order_detail.quantity) AS total_price
                    FROM order_detail
                    JOIN orders
                    ON order_detail.order_id = orders.order_id
                    GROUP BY monthly
                    ORDER BY monthly;

                      `

    conn.query(sqlGraphMonthly, (error, results) => {
        if (error) {
            res.status(400).json({ error })
        }
        else {
            results = results.map(result => ({
                monthly: convertToBangkokTimeforMonth(result.monthly),
                total_price: result.total_price
            }));
            res.json(results);
        }

    })
}

exports.readGraphMonthly = (req, res) => {
    const {id} = req.params
    const sqlGraphMonthly = `
                    SELECT DATE_FORMAT(orders.order_date_time, '%Y-%m') AS monthly, 
                    SUM(order_detail.price * order_detail.quantity) AS total_price
                    FROM order_detail
                    JOIN orders
                    ON order_detail.order_id = orders.order_id
                    WHERE DATE_FORMAT(orders.order_date_time, '%Y') = ?   
                    GROUP BY monthly
                    ORDER BY monthly;

                      `

    conn.query(sqlGraphMonthly, id,(error, results) => {
        if (error) {
            res.status(400).json({ error })
        }
        else {
            results = results.map(result => ({
                monthly: convertToBangkokTimeforMonth(result.monthly),
                total_price: result.total_price
            }));
            res.json(results);
        }

    })
}


exports.readDaily = (req, res) => {
    // ดึงค่าจาก URL parameter
    const { id } = req.params;

    // กำหนดคำสั่ง SQL พร้อมการใช้ตัวแปร
    const SqlDaily = `
        SELECT DATE(order_date_time) as Date, SUM(order_detail.price * order_detail.quantity) as TotalSales
        FROM orders
        JOIN order_detail ON order_detail.order_id = orders.order_id
        WHERE DATE_FORMAT(order_date_time, '%Y-%m-%d') = ?
        GROUP BY DATE(order_date_time)
    `;

    // ค่าที่ใช้ในคำสั่ง SQL
    const values = [id];

    // คิวรีฐานข้อมูล
    conn.query(SqlDaily, values, (error, results) => {
        if (error) {
            res.status(400).json({ error });
        } else {
            // แปลงวันที่เป็นเวลาในเขตเวลา Bangkok
            // results = results.map(result => ({
            //     Date: convertToBangkokTimeforMonth(result.Date),
            //     TotalSales: result.TotalSales
            // }));
            res.json(results);
        }
    });
};


exports.readMonthly = (req, res) => {

    const { id } = req.params
    const sqlMonthly = `
                    SELECT DATE_FORMAT(orders.order_date_time, '%Y-%m') AS monthly, 
                    SUM(order_detail.price * order_detail.quantity) AS total_price
                    FROM order_detail
                    JOIN orders
                    ON order_detail.order_id = orders.order_id
                    WHERE  DATE_FORMAT(orders.order_date_time, '%Y-%m') = ?
                    GROUP BY monthly
                    ORDER BY monthly
                    `
    const value = [id]
    conn.query(sqlMonthly, value, (error, results) => {
        if (error) {
            res.status(400).json({ error })
        } else {
            results = results.map(result => ({
                Date: convertToBangkokTimeforMonth(result.monthly),
                TotalSales: result.total_price
            }));
            res.json(results);
        }
    })
}

exports.readYear = (req, res) => {
    const { id } = req.params
    const sqlYear = `
                        SELECT YEAR(orders.order_date_time) AS year, 
                        SUM(order_detail.price * order_detail.quantity) AS total_price
                        FROM order_detail
                        JOIN orders ON order_detail.order_id = orders.order_id
                        WHERE YEAR(orders.order_date_time) = ?
                        GROUP BY YEAR(orders.order_date_time)
                    `
    const value = [id]

    conn.query(sqlYear, value, (error, results) => {
        if (error) {
            res.status(400).json({ error })
        } else {
            results = results.map(result => ({
                Date: convertToBangkokTimeforMonth(result.sqlYear),
                TotalSales: result.total_price
            }))
            res.json(results)
        }
    })
}

exports.topProductMonth = (req, res) => {
    const { month } = req.params
    const sqlTop = `
                   SELECT
                        order_detail.p_id AS product_id,
                        products.p_name AS Product_Name,
                        SUM(order_detail.price * order_detail.quantity) AS total_sales,
                        SUM(order_detail.quantity) AS quantity
                    FROM
                        order_detail
                    JOIN
                        orders ON order_detail.order_id = orders.order_id
                    JOIN 
                        products ON order_detail.p_id = products.p_id
                    WHERE  
                        DATE_FORMAT(orders.order_date_time, '%Y-%m') = ?
                    GROUP BY
                        order_detail.p_id
                    ORDER BY
                        total_sales DESC
                    LIMIT 5;

                   `
    const value = [month]

    conn.query(sqlTop, value, (error, results) => {
        if (error) {
            res.status(400).json({ error })
        } else {
            res.json(results)
        }
    })
}

exports.topProductYear = (req, res) => {
    const { year } = req.params
    const sqlTop = `
                   SELECT
                        order_detail.p_id AS product_id,
                        products.p_name AS Product_Name,
                        SUM(order_detail.price * order_detail.quantity) AS total_sales,
                        SUM(order_detail.quantity) AS quantity
                    FROM
                        order_detail
                    JOIN
                        orders ON order_detail.order_id = orders.order_id
                    JOIN 
                        products ON order_detail.p_id = products.p_id
                    WHERE  
                        DATE_FORMAT(orders.order_date_time, '%Y') = ?
                    GROUP BY
                        order_detail.p_id
                    ORDER BY
                        total_sales DESC
                    LIMIT 5;

                   `
    const value = [year]

    conn.query(sqlTop, value, (error, results) => {
        if (error) {
            res.status(400).json({ error })
        } else {
            res.json(results)
        }
    })
}


exports.readRepotSales = (req, res) => {
    const { startDate, endDate } = req.params;

    // คิวรียอดขายรวม
    const totalSalesQuery = `
        SELECT SUM(order_detail.price * order_detail.quantity) AS total_amount
        FROM orders
        JOIN order_detail ON orders.order_id = order_detail.order_id
        WHERE DATE(orders.order_date_time) BETWEEN ? AND ?`;

    // คิวรีข้อมูลสินค้าทั้งหมด
    const products = `
        SELECT order_detail.p_id, SUM(order_detail.quantity) AS qty, products.p_name as name, SUM(order_detail.price * order_detail.quantity) as amount, products.p_price as price
        FROM order_detail
        JOIN orders ON orders.order_id = order_detail.order_id
        JOIN products ON order_detail.p_id = products.p_id
        WHERE DATE(orders.order_date_time) BETWEEN ? AND ?
        GROUP BY order_detail.p_id
        ORDER BY p_id ASC`;

    // คิวรีสินค้าขายดี
    const topProductsQuery = `
        SELECT
            order_detail.p_id AS product_id,
            products.p_name AS Product_Name,
            SUM(order_detail.price * order_detail.quantity) AS total_sales,
            SUM(order_detail.quantity) AS quantity
        FROM
            order_detail
        JOIN
            orders ON order_detail.order_id = orders.order_id
        JOIN 
            products ON order_detail.p_id = products.p_id
        WHERE DATE(orders.order_date_time) BETWEEN ? AND ?
        GROUP BY
            order_detail.p_id
        ORDER BY
            total_sales DESC
        LIMIT 5`;

    // คิวรีข้อมูลยอดขายตามประเภทการชำระเงิน
    const sqlPaymentType = `
        SELECT SUM(order_detail.price * order_detail.quantity) AS total_sales, orders.payment_type
        FROM order_detail
        JOIN orders ON order_detail.order_id = orders.order_id
        WHERE DATE(orders.order_date_time) BETWEEN ? AND ?
        GROUP BY orders.payment_type`;

    // คิวรีข้อมูล redeem points
    const redeemQuery = `
       SELECT 
       COUNT(*) AS redeem_count,
       SUM(5) AS total_redeem_value
        FROM points_history
        WHERE type = 'redeem' AND DATE(transaction_date) BETWEEN ? AND ?;
    `;

    // ดึงยอดขายรวม
    conn.query(totalSalesQuery, [startDate, endDate], (error, totalSalesResults) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // ดึงสินค้าทั้งหมด
        conn.query(products, [startDate, endDate], (error, topSellingProductsResults) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }

            // ดึงสินค้าขายดี
            conn.query(topProductsQuery, [startDate, endDate], (error, topProductsResults) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }

                // ดึงข้อมูลยอดขายตามประเภทการชำระเงิน
                conn.query(sqlPaymentType, [startDate, endDate], (error, paymentTypeResults) => {
                    if (error) {
                        return res.status(500).json({ error: error.message });
                    }

                    // ดึงข้อมูลการใช้ redeem points
                    conn.query(redeemQuery, [startDate, endDate], (error, redeemResults) => {
                        if (error) {
                            return res.status(500).json({ error: error.message });
                        }

                        // ส่งข้อมูลผลลัพธ์ทั้งหมดกลับไป
                        res.json({
                            totalSales: totalSalesResults[0],
                            products: topSellingProductsResults,
                            topProducts: topProductsResults,
                            paymentTypes: paymentTypeResults,
                            redeemPoints: redeemResults // เพิ่มข้อมูล redeem
                        });
                    });
                });
            });
        });
    });
};

