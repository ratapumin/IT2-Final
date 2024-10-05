const Printer = require('node-thermal-printer').printer;
const types = require('node-thermal-printer').types;
const conn = require('../db');
const generatePayload = require('promptpay-qr'); // เพิ่มการนำเข้า

exports.printReceipt = async (req, res) => {
  const { order_id, order_no, order_date_time, customer, products, history, paymentMethod, sumCash } = req.body; // รับ sumCash จาก request

  // คำสั่ง SQL เดิม
  const sqlCustomer = `SELECT c_fname as firstname, c_lname as lastname, c_points FROM customers WHERE c_id = ?`;
  const sqlProduct = `SELECT p_name, p_price FROM products WHERE p_id = ?`;

  // คำนวณคะแนนรวมที่ได้รับและใช้
  let totalEarn = 0;
  let totalRedeem = 0;

  history.forEach(entry => {
    if (entry.type === 'earn') {
      totalEarn += entry.points;
    } else if (entry.type === 'redeem') {
      totalRedeem += entry.points;
    }
  });

  const productQueries = products.map(product => {
    return new Promise((resolve, reject) => {
      conn.query(sqlProduct, [product.p_id], (error, productResult) => {
        if (error) {
          return reject(error);
        }
        if (productResult.length === 0) {
          return reject(new Error('Product not found'));
        }
        const productData = productResult[0];
        resolve({
          p_id: product.p_id,
          p_name: productData.p_name,
          p_price: productData.p_price,
          quantity: product.quantity
        });
      });
    });
  });

  try {
    const productsData = await Promise.all(productQueries);
    const subtotal = productsData.reduce((acc, product) => acc + (product.p_price * product.quantity), 0);
    let discount = totalRedeem ? 5 : 0;
    const totalPrice = subtotal - discount;

    const receipt = [];
    const totalWidth = 40;

    if (paymentMethod === 'promptpay') {
      // สร้าง QR Code สำหรับการชำระเงินโดยใช้ sumCash
      const qrCodeData = generatePayload(customer.phoneNumber, { amount: sumCash });
      receipt.push('------------------------------------------');
      receipt.push('QR Code for Payment:');
      receipt.push(qrCodeData);
    }

    receipt.push(`Emp: Ratapumin   #${order_id}   #${order_no}`.padEnd(totalWidth));
    receipt.push(`Date: ${order_date_time.split(' ')[0]}`.padEnd(totalWidth));
    receipt.push(`Time: ${order_date_time.split(' ')[1]}`.padEnd(totalWidth));
    receipt.push('------------------------------------------');
    receipt.push('Item                   Qty     Amount');

    productsData.forEach(product => {
      const itemLine = `${product.p_name.padEnd(20)} ${String(product.quantity).padEnd(8)} ${product.p_price * product.quantity}`;
      receipt.push(itemLine);
    });

    receipt.push('------------------------------------------');
    receipt.push(`Subtotal:                ${subtotal}`.padEnd(35));
    receipt.push(`Discount:                ${discount}`.padEnd(35));
    receipt.push(`Total:                   ${totalPrice}`.padEnd(35));

    // ตรวจสอบข้อมูลลูกค้า
    // Update this part of your code
    if (customer && customer.c_id) {
      const customerId = customer.c_id;
      conn.query(sqlCustomer, [customerId], (error, customerResult) => {
        if (error || customerResult.length === 0) {
          console.error("Customer not found or error:", error);
        } else {
          const customerData = customerResult[0];
          receipt.push('------------------------------------------');
          receipt.push(` Customer: ${customerData.firstname} ${customerData.lastname}`.padEnd(totalWidth));
          receipt.push('*** Point ***');
          receipt.push(`Collect: ${totalEarn}   Redeem: ${totalRedeem}   Current: ${customerData.c_points + totalRedeem + totalEarn}`);
        }

        receipt.push('------------------------------------------');
        receipt.push('Thank you');
        receipt.push('Please come again soon');
        logReceipt(receipt);
        printReceipt(receipt, res);  // Pass the res object here
      });
    } else {
      receipt.push('------------------------------------------');
      receipt.push('Thank you');
      receipt.push('Please come again soon');
      receipt.push(`Method:${paymentMethod}`);
      logReceipt(receipt);
      printReceipt(receipt, res);  // Pass the res object here
    }

  } catch (error) {
    console.error("Failed to get products:", error);
    res.status(500).json({ message: "Failed to get product details.", error });
  }
};




// ฟังก์ชันสำหรับบันทึกใบเสร็จ
function logReceipt(receipt) {
  console.log("Receipt:\n", receipt.join('\n'));
}

// ฟังก์ชันพิมพ์ใบเสร็จ
function printReceipt(receipt, res) {
  const printer = new Printer({
    type: types.EPSON,
    interface: '//localhost/printer', // sharing
    options: {
      timeout: 10000, // เพิ่ม timeout ในการเชื่อมต่อ
    }
  });

  try {
    // ตั้งค่าข้อมูลที่จะพิมพ์
    printer.alignCenter();
    printer.bold(true);
    printer.setTextQuadArea(0, 0, 1, 1); // กำหนดพื้นที่ในการพิมพ์ (x, y, width, height)
    printer.println('Khathong Coffee');
    printer.newLine();
    printer.bold(false);
    printer.setTextNormal()
    receipt.forEach(line => {
      printer.println(line);
    });
    printer.cut();
    printer.execute();

    console.log("Print done!");
    res.status(200).json({ message: "Receipt printed successfully." });
  } catch (error) {
    console.error("Print failed:", error);
    res.status(500).json({ message: "Failed to print receipt.", error });
  }
}
