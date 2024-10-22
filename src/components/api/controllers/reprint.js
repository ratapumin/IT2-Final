const Printer = require('node-thermal-printer').printer;
const types = require('node-thermal-printer').types;
const conn = require('../db');

// Utility function to format currency values
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }).format(Number(value));
};

// Function to fetch all order IDs
exports.showOrderIs = (req, res) => {
    const sqlSelectOrderId = `SELECT order_id FROM orders`;

    conn.query(sqlSelectOrderId, (error, result) => {
        if (error) {
            return res.status(400).json({ error });
        }
        return res.json(result);
    });
};

// Function to reprint a receipt
exports.reprintReceipt = (req, res) => {
    const { order_id } = req.params;

    // SQL queries for receipt and point history
    const sqlSelectReceipt = `
                            SELECT 
                                orders.order_id, 
                                order_detail.order_detail_id, 
                                products.p_name, 
                                products.category,
                                order_detail.quantity, 
                                order_detail.price
                            FROM 
                                orders 
                            JOIN 
                                order_detail ON orders.order_id = order_detail.order_id
                            JOIN 
                                products ON order_detail.p_id = products.p_id 
                            WHERE 
                                orders.order_id = ?

                                `
    const sqlPointHistory = `
                        SELECT 
                            points_history.type,
                            points_history.points,
                            orders.order_date_time, 
                            orders.payment_type, 
                            orders.order_id,
                            orders.order_no, 
                            orders.c_id,
                            customers.c_fname,
                            customers.c_lname,
                            orders.user_id,
                            user_account.user_fname,
                            user_account.user_lname
                        FROM 
                            orders
                        LEFT JOIN 
                            points_history ON orders.order_id = points_history.order_id -- ใช้ LEFT JOIN เพื่อแสดงข้อมูลที่ไม่มีใน points_history
                        LEFT JOIN 
                            customers ON customers.c_id = orders.c_id -- ใช้ LEFT JOIN กับ customers
                        JOIN
                            user_account ON user_account.user_id = orders.user_id
                        WHERE 
                            orders.order_id = ?
                          `

    const values = [order_id];

    // Fetch receipt details
    conn.query(sqlSelectReceipt, values, (error, ReceiptResult) => {
        if (error) {
            return res.status(400).json({ error });
        }

        // Fetch points history
        conn.query(sqlPointHistory, values, (error, PointHistoryResult) => {
            if (error) {
                return res.status(400).json({ error });
            }

            // Log the receipt if necessary
            // logReceipt(ReceiptResult);

            // Return the combined results
            res.json({ ReceiptResult, PointHistoryResult });
            // console.log( ReceiptResult, PointHistoryResult)
        });
    });
};

// Function to log receipt data to the console
function logReceipt(receipt) {
    console.log("Receipt:\n", receipt.map(item => JSON.stringify(item)).join('\n'));
}

// Function to print a receipt
exports.printReceipt = (req, res) => {
    const { receiptData, statusPrint } = req.body;
    console.log(receiptData)

    if (!receiptData) {
        return res.status(400).json({ message: 'No data provided.' });
    }

    const reprintData = generateReceiptContent(receiptData);
    logReceipt(reprintData); // Log the receipt content

    if (statusPrint === 'print') {
        reprintReceipt(reprintData, res);
    } else {
        return res.status(200).json({ message: 'Receipt data processed successfully.', receipt: reprintData });
    }
};

// Function to generate receipt content from data
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
    receipt.push(`Discount:                ${receiptData.discount.toFixed(2).padStart(5)}`.padEnd(35));
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


// Function to handle receipt printing
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

        // Printing logic
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

        await printer.execute();
        console.log('Print done!');
        return res.status(200).json({ message: "Receipt printed successfully." });

    } catch (error) {
        console.error("Print failed:", error);
        return res.status(500).json({ message: "Failed to print receipt.", error });
    }
}




// #	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
// 1	order_id Primary	varchar(12)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 2	order_no	int(3)			No	None			Change Change	Drop Drop
// 3	order_date_time	timestamp			No	current_timestamp()		ON UPDATE CURRENT_TIMESTAMP()	Change Change	Drop Drop
// 4	payment_type	varchar(10)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 5	user_id Index	int(5)			Yes	NULL			Change Change	Drop Drop
// 6	c_id Index	int(5)			Yes	NULL			Change Change	Drop Drop


// #	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
// 1	c_id Primary	int(5)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
// 2	c_tel Index	varchar(10)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 3	c_fname	varchar(30)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 4	c_lname	varchar(30)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 5	c_points	int(11)			Yes	0			Change Change	Drop Drop
// 6	c_status	varchar(10)	utf8mb4_general_ci		Yes	NULL			Change Change	Drop Drop


// #	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
// 1	order_detail_id Primary	int(3)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
// 2	order_id Index	varchar(12)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 3	p_id Index	int(5)			No	None			Change Change	Drop Drop
// 4	quantity	int(5)			No	None			Change Change	Drop Drop
// 5	price	decimal(10,2)			Yes	NULL			Change Change	Drop Drop


// #	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
// 1	id Primary	int(11)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
// 2	c_id Index	int(11)			Yes	NULL			Change Change	Drop Drop
// 3	points	int(11)			Yes	NULL			Change Change	Drop Drop
// 4	type	enum('earn', 'redeem')	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 5	transaction_date	datetime			Yes	current_timestamp()			Change Change	Drop Drop
// 6	order_id Index	varchar(12)	utf8mb4_general_ci		No	None			Change Change	Drop Drop


// #	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
// 1	p_id Primary	int(5)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
// 2	p_name	varchar(30)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 3	p_price	float			No	None			Change Change	Drop Drop
// 4	p_type	varchar(10)	utf8mb4_general_ci		Yes	NULL			Change Change	Drop Drop
// 5	category	text	utf8mb4_general_ci		Yes	NULL			Change Change	Drop Drop

// #	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
// 1	user_id Primary	int(5)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
// 2	user_fname	varchar(30)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 3	user_lname	varchar(30)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 4	user_tel Index	varchar(10)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 5	user_id_card Index	varchar(13)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 6	role_type	varchar(1)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 7	user_status	varchar(10)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
// 8	user_password	varchar(15)	utf8mb4_general_ci		Yes	NULL			Change Change	Drop Drop	
