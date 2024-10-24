const conn = require('../db');


exports.payment = (req, res) => {
    let {
        order_id,
        order_no,
        order_date_time,
        payment_type,
        user_id,
        c_id,
        products,
        history, // Expecting an array now
        customer
    } = req.body;

    if (!c_id) {
        c_id = null;
    }
    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Products data is required and must be an array' });
    }
    if (!Array.isArray(history)) {
        history = [history]; // Wrap in an array if it's not already one
    }


    const sqlOrder = 'INSERT INTO orders (order_id, order_no, order_date_time, payment_type, user_id, c_id) VALUES (?, ?, ?, ?, ?, ?)';
    const sqlOrderDetail = 'INSERT INTO order_detail (order_id, p_id, quantity, price) VALUES (?, ?, ?, ?)';
    const sqlPointsHistory = 'INSERT INTO points_history (c_id, points, type, transaction_date, order_id) VALUES (?, ?, ?, ?, ?)';
    const sqlUpdateCustomer = `UPDATE customers SET c_points = COALESCE(c_points, 0) + ? WHERE c_id = ?`;

    conn.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error starting transaction', details: err });
        }

        // Insert into Orders table
        conn.query(sqlOrder, [order_id, order_no, order_date_time, payment_type, user_id, c_id], (err) => {
            if (err) {
                return conn.rollback(() => {
                    res.status(500).json({ error: 'Error inserting order', details: err });
                });
            }

            // Insert into Order_detail table for all products
            const orderDetailData = products.map(product => [order_id, product.p_id, product.quantity, product.p_price]);
            const insertOrderDetails = orderDetailData.map(data => {
                return new Promise((resolve, reject) => {
                    conn.query(sqlOrderDetail, data, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            // Insert into Points_history for each history entry
            const insertHistoryEntries = history.map(entry => {
                return new Promise((resolve, reject) => {
                    conn.query(sqlPointsHistory, [entry.c_id, entry.points, entry.type, entry.transaction_data, order_id], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            // Update customer points
            const updateCustomer = new Promise((resolve, reject) => {
                conn.query(sqlUpdateCustomer, [customer.c_points, customer.c_id], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });

            // Use Promise.all to wait for all inserts to complete
            Promise.all([...insertOrderDetails, ...insertHistoryEntries, updateCustomer])
                .then(() => {
                    conn.commit((err) => {
                        if (err) {
                            return conn.rollback(() => {
                                res.status(500).json({ error: 'Error committing transaction', details: err });
                            });
                        }
                        res.send('Order created successfully');
                    });
                })
                .catch(err => {
                    conn.rollback(() => {
                        res.status(500).json({ error: 'Error processing transaction', details: err });
                    });
                });
        });
    });
};

exports.pointstype = (req, res) => {
    const { date } = req.params
    const sqlPointType = `
                        SELECT 
                            points_history.type,
                            orders.payment_type,
                            orders.order_date_time 
                        FROM 
                            points_history
                        JOIN 
                            orders ON orders.order_id = points_history.order_id
                        WHERE 
                            DATE(orders.order_date_time) = ?

    `;
    const value = [date]
    conn.query(sqlPointType, value, (error, resultsPoint) => {
        if (error) {
            // Handle sqlPointType error
            return res.status(400).json({ error });
        }

        // Both queries successful, send response with both results
        res.json(resultsPoint);
        // exports.closedaily(req, res, resultsPoint);

    });
}

exports.pointsTypemonthly = (req, res) => {
    const { monthly } = req.params
    const sqlPointType = `
                           SELECT 
                                points_history.type,
                                orders.payment_type,
                                orders.order_date_time 
                            FROM 
                                points_history
                            JOIN 
                                orders ON orders.order_id = points_history.order_id
                            WHERE 
                                DATE_FORMAT(orders.order_date_time, '%Y-%m') = ?

                        `;
    const value = [monthly]
    conn.query(sqlPointType, value, (error, resultsPoint) => {
        if (error) {
            // Handle sqlPointType error
            return res.status(400).json({ error });
        }

        // Both queries successful, send response with both results
        res.json(resultsPoint);
        // exports.closedaily(req, res, resultsPoint);

    });
}



exports.pointsTypeYear = (req, res) => {
    const { year } = req.params
    const sqlPointType = `
                            SELECT 
                                points_history.type,
                                orders.payment_type,
                                orders.order_date_time 
                            FROM 
                                points_history
                            JOIN 
                                orders ON orders.order_id = points_history.order_id
                            WHERE 
                                YEAR(orders.order_date_time) = ?


                        `;
    const value = [year]
    conn.query(sqlPointType, value, (error, resultsPoint) => {
        if (error) {
            // Handle sqlPointType error
            return res.status(400).json({ error });
        }

        // Both queries successful, send response with both results
        res.json(resultsPoint);
        // exports.closedaily(req, res, resultsPoint);

    });
}

exports.closedaily = (req, res) => {
    const { cash_in_machine, date, user_id, redeem_count } = req.body;

    // ดึงค่า redeem_count จาก resultsPoint เพื่อใช้ในการลบ
    const redeeDiscount = redeem_count * 5
    console.log('redeeo', redeeDiscount)

    const sqlClosedaily = `
    INSERT INTO closedaily (cash_in_machine, cash_in_system, cash_difference, user_id, date)
    SELECT 
        ? AS cash_in_machine,
        (SUM(order_detail.price * order_detail.quantity) - ?) AS cash_in_system,  -- หักด้วย redeemCount
        (? - (SUM(order_detail.price * order_detail.quantity)  - ?)) AS cash_difference,  -- หัก redeemCount และ cash_in_machine
        ?, 
        ?
    FROM order_detail
    JOIN orders ON order_detail.order_id = orders.order_id 
    WHERE DATE(orders.order_date_time) = ?
    AND orders.payment_type = 'cash';
`;


    const value = [cash_in_machine, redeeDiscount, cash_in_machine, redeeDiscount, user_id, date, date];


    conn.query(sqlClosedaily, value, (error, results) => {
        if (error) {
            res.status(400).json({ error });
        } else {
            res.json(results);
        }
    });
};
