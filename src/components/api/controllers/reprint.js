
const Printer = require('node-thermal-printer').printer;
const types = require('node-thermal-printer').types;
const conn = require('../db');


const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }).format(Number(value));
  };

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
                                products.category,
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

function logReceipt(receipt) {
    console.log("Receipt:\n", receipt.join('\n'));
}


exports.printReceipt = (req, res) => {
    const { receiptData, statusPrint } = req.body;
    if (receiptData) {
        const reprintData = generateReceiptContent(receiptData);
        logReceipt(reprintData); // Log the receipt content

        if (statusPrint === 'print') {
            console.log('rere', statusPrint)
            reprintReceipt(reprintData, res);
        } else {
            return res.status(200).json({ message: 'Receipt data processed successfully.', receipt: reprintData });
        }
    } else {
        return res.status(500).json({ message: 'No data provided.' });
    }
};

function generateReceiptContent(receiptData) {
    const receipt = [];
    const totalWidth = 40; // Width for formatting

    // Order details
    const dateStr = `Date: ${receiptData.order_date}`;
    const timeStr = `Time: ${receiptData.order_time}`;
    const orderNoStr = `${receiptData.order_no}`;
    const orderIdStr = `${receiptData.order_id}`;

    receipt.push('------------------------------------------');
    receipt.push(`Emp: ${receiptData.user_fname.charAt(0).toUpperCase() + receiptData.user_fname.slice(1)}   #${orderIdStr}   #${orderNoStr}`.padEnd(totalWidth));
    if (dateStr) receipt.push(dateStr.padEnd(totalWidth));
    if (timeStr) receipt.push(timeStr.padEnd(totalWidth));


    receipt.push('-----------------------------------------');

    // Products
    receipt.push('Item                    Type   Qty  Amount');
    receiptData.products.forEach(item => {
        const name = String(item.p_name).padEnd(24); // Product name with padding
        const category = String(item.category).padEnd(5); // Category with padding
        const quantity = String(item.quantity).padEnd(2); // Convert quantity to string and pad
        const amount = String(item.quantity * item.p_price).padStart(6); // Convert total amount to string and pad
        // const itemLine = `${name.padEnd(24)} ${category.padEnd(5)} ${String(quantity).padEnd(4)} ${String(amount).padStart(6)}`;
        receipt.push(`${name}${category}${quantity}${amount}`);
        // receipt.push(itemLine);

    });

    // Subtotal, Discount, and Total
    receipt.push('-----------------------------------------');
    receipt.push(`Subtotal:                ${receiptData.subtotal.toString().padStart(5)}`.padEnd(35))
    receipt.push(`Discount:                ${receiptData.discount.toString().padStart(5)}`.padEnd(35));
    receipt.push(`Total:                   ${receiptData.total.toString().padStart(5)}`.padEnd(35));


    receipt.push('-----------------------------------------');
    // Customer information
    if (receiptData.customer) {
        const customerStr = `Customer: ${receiptData.customer}`;
        receipt.push(customerStr.padEnd(totalWidth));
    }
    // Points Information
    if (receiptData.pointsEarned || receiptData.pointsRedeemed) {
        receipt.push('*** Points ***');
        const pointsEarnedStr = receiptData.pointsEarned
        const pointsRedeemedStr = receiptData.pointsRedeemed

        receipt.push(`Collect: ${pointsEarnedStr}   Redeem: ${pointsRedeemedStr}`);

        receipt.push('-----------------------------------------');
    }

    receipt.push('Thank you');
    receipt.push('Please come again soon');

    return receipt;
}

async function reprintReceipt(receipt, res) {
    const printer = new Printer({
        type: types.EPSON,
        interface: '//localhost/printer',
        options: {
            timeout: 10000,
            encoding: 'utf8'
        },
    });

    try {
        if (!receipt || receipt.length === 0) {
            console.error('Receipt is empty or undefined.');
            return res.status(400).json({ message: "No receipt to print." });
        }

        console.log('Receipt Content:', receipt);

        printer.alignCenter();
        printer.bold(true);
        printer.setTextQuadArea(0, 0, 1, 1);
        printer.println('Re-Print');
        printer.println('Kathong Coffee');
        printer.bold(false);
        printer.newLine();
        printer.setTextNormal();
        // Print receipt lines
        receipt.forEach(line => {
            if (typeof line === 'string' && line.trim()) {
                printer.println(line);
            } else {
                console.error('Invalid line:', line);
            }
        });

        printer.cut();
        try {
            await printer.execute();
        } catch (executeError) {
            console.error('Error executing print command:', executeError);
        }

        console.log('Print done!');
        return res.status(200).json({ message: "Receipt printed successfully." });

    } catch (error) {
        console.error("Print failed:", error);
        return res.status(500).json({ message: "Failed to print receipt.", error });
    }
}
