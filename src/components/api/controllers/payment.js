const conn = require('../db');

exports.payment = (req, res) => {
    let { order_id, order_no, order_date_time, payment_type, user_id, c_id, products } = req.body;
    if (!c_id) {
        c_id = null;
    }
    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Products data is required and must be an array' });
    }

    const sqlOrder = 'INSERT INTO orders (order_id, order_no, order_date_time, payment_type, user_id, c_id) VALUES (?, ?, ?, ?, ?, ?)';
    const sqlOrderDetail = 'INSERT INTO order_detail (order_id, p_id, quantity, price) VALUES (?, ?, ?, ?)';

    conn.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error starting transaction' });
        }

        conn.query(sqlOrder, [order_id, order_no, order_date_time, payment_type, user_id, c_id], (err, result) => {
            if (err) {
                return conn.rollback(() => {
                    res.status(500).json({ error: 'Error inserting order', details: err });
                });
            }

            const newOrderId = result.insertId;


            const orderDetailData = products.map(product => [newOrderId, product.p_id, product.quantity, product.p_price]);

            let completed = 0;

            orderDetailData.forEach(data => {
                conn.query(sqlOrderDetail, data, (err) => {
                    if (err) {
                        return conn.rollback(() => {
                            res.status(500).json({ error: 'Error inserting order detail', details: err });
                        });
                    }

                    completed++;

                    if (completed === orderDetailData.length) {
                        conn.commit((err) => {
                            if (err) {
                                return conn.rollback(() => {
                                    res.status(500).json({ error: 'Error committing transaction', details: err });
                                });
                            }

                            return res.send('Order created successfully');
                        });
                    }
                });
            });

        });
    });
};
