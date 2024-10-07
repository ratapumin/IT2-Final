const Printer = require('node-thermal-printer').printer;
const types = require('node-thermal-printer').types;
const conn = require('../db');
const generatePayload = require('promptpay-qr');
const fs = require('fs');
const QRCode = require('qrcode');
const path = require('path');

exports.printReceipt = async (req, res) => {
  console.log("Incoming request body:", req.body);
  const phoneNumber = '0621645650';
  const { order_id, order_no, order_date_time, customer, products, history, paymentMethod, cash, change } = req.body;

  const sqlCustomer = `SELECT c_fname as firstname, c_lname as lastname, c_points FROM customers WHERE c_id = ?`;
  const sqlProduct = `SELECT p_name, p_price FROM products WHERE p_id = ?`;

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

    let qrCodePath = null; // กำหนด path สำหรับไฟล์ QR Code
    if (paymentMethod === 'promtpay') {
      const qrCodeData = generatePayload(phoneNumber, { amount: totalPrice });
      qrCodePath = path.join(__dirname, `qrcode_${order_id}.png`);
      const options = { type: 'png', color: { dark: '#000', light: '#fff' }, width: 200 };

      await new Promise((resolve, reject) => {
        QRCode.toFile(qrCodePath, qrCodeData, options, (err) => {
          if (err) return reject(err);
          console.log('QR Code created as PNG:', qrCodePath);
          resolve();
        });
      });
    }

    // สร้างบรรทัดต่างๆ สำหรับใบเสร็จ
    receipt.push('------------------------------------------');
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
    receipt.push(`Subtotal:                ${subtotal.toString().padStart(5)}`.padEnd(35));
    receipt.push(`Discount:                ${discount.toString().padStart(5)}`.padEnd(35));
    receipt.push(`Total:                   ${totalPrice.toString().padStart(5)}`.padEnd(35));
    
    // ซ่อน Cash และ Change ถ้าเป็น promtpay
    if (paymentMethod !== 'promtpay') {
      receipt.push(`Cash:                    ${cash.toString().padStart(5)}`.padEnd(35));
      receipt.push(`Change:                  ${change.toString().padStart(5)}`.padEnd(35));
      console.log('Received cash:', cash);
      console.log('Received change:', change);
    }

    // ตรวจสอบข้อมูลลูกค้า
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
        printReceipt(receipt, res, qrCodePath);
      });
    } else {
      receipt.push('------------------------------------------');
      receipt.push('Thank you');
      receipt.push('Please come again soon');
      receipt.push(`Method: ${paymentMethod}`);
      logReceipt(receipt);
      printReceipt(receipt, res, qrCodePath);
    }

  } catch (error) {
    console.error("Failed to get products:", error);
    res.status(500).json({ message: "Failed to get product details.", error });
  }
};


function logReceipt(receipt) {
  console.log("Receipt:\n", receipt.join('\n'));
}

async function printReceipt(receipt, res, qrCodePath) {
  const printer = new Printer({
    type: types.EPSON,
    interface: '//localhost/printer',
    options: {
      timeout: 10000,
    }
  });

  try {
    printer.alignCenter();
    printer.bold(true);
    printer.setTextQuadArea(0, 0, 1, 1);
    printer.println('Khathong Coffee');
    printer.bold(false);
    if (qrCodePath) {
      printer.newLine();
      await printer.printImage(qrCodePath, { width: 200, height: 200 }); // Print PNG image
    }
    printer.newLine();
    printer.setTextNormal();

    receipt.forEach(line => {
      printer.println(line);
    });

  

    printer.cut();
    await printer.execute();

    console.log("Print done!");
    if (res) {
      res.status(200).json({ message: "Receipt printed successfully." });
    }

    if (qrCodePath) {
      fs.unlinkSync(qrCodePath); // ลบไฟล์ PNG เมื่อใช้งานเสร็จ
      console.log('QR Code PNG deleted:', qrCodePath);
    }
  } catch (error) {
    console.error("Print failed:", error);
    if (res) {
      res.status(500).json({ message: "Failed to print receipt.", error });
    }
  }
}
