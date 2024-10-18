
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
                            SELECT 
                                orders.order_id, 
                                orders.order_no, 
                                orders.order_date_time, 
                                orders.payment_type, 
                                orders.user_id, 
                                orders.c_id, 
                                customers.c_fname,      -- ชื่อของลูกค้า
                                customers.c_lname,      -- นามสกุลของลูกค้า
                                order_detail.order_detail_id, 
                                order_detail.p_id, 
                                products.p_name, 
                                order_detail.quantity, 
                                order_detail.price,
                                points_history.points,          -- คะแนนสะสมจากตาราง points
                                points_history.type,            -- ประเภท (สะสมหรือใช้แต้ม)
                                points_history.transaction_date, -- วันที่การทำธุรกรรม
                                user_account.user_fname        -- ชื่อของพนักงานจากตาราง User_accounts
                            FROM 
                                orders
                            LEFT JOIN 
                                order_detail ON orders.order_id = order_detail.order_id
                            LEFT JOIN 
                                products ON order_detail.p_id = products.p_id 
                            LEFT JOIN 
                                customers ON orders.c_id = customers.c_id  -- JOIN กับตารางลูกค้า
                            LEFT JOIN 
                                points_history ON points_history.c_id = orders.c_id AND points_history.transaction_date = orders.order_date_time  -- JOIN กับตาราง points และเช็คว่าเวลาตรงกัน
                            LEFT JOIN 
                                user_account ON orders.user_id = user_account.user_id  -- JOIN กับตาราง User_accounts เพื่อดึงชื่อของพนักงาน
                            WHERE 
                                orders.order_id = ?

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