const { query } = require('express');
const conn = require('../db')
const moment = require('moment-timezone');

const convertToBangkokTime = (date) => moment(date).tz('Asia/Bangkok').format('YYYY-MM-DD');
const convertToBangkokTimeforMonth = (date) => moment(date).tz('Asia/Bangkok').format('YYYY-MM');



exports.readTypeSales = (req, res) => {

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



exports.readGraphMonthly = (req, res) => {
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

exports.topProduct = (req,res)=>{
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
                    GROUP BY
                        order_detail.p_id
                    ORDER BY
                        total_sales DESC
                    LIMIT 5;

                   `
    conn.query(sqlTop,(error,results)=>{
        if(error){
            res.status(400).json({error})
        }else{
            res.json(results)
        }
    })
}


