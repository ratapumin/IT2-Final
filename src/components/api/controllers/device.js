const Printer = require('node-thermal-printer').printer;
const types = require('node-thermal-printer').types;
const conn = require('../db');
const generatePayload = require('promptpay-qr'); // นำเข้าแพ็คเกจสร้าง QR Code
const fs = require('fs'); // ใช้สำหรับเขียนไฟล์
const QRCode = require('qrcode'); // นำเข้าไลบรารี qrcode
const path = require('path'); // เพิ่มการนำเข้า path

exports.printReceipt = async (req, res) => {
  const phoneNumber = '0621645650'; // หมายเลขโทรศัพท์สำหรับ PromptPay
  const { order_id, order_no, order_date_time, customer, products, history, paymentMethod, sumCash } = req.body;

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

    // QR Code for PromptPay
    let qrCodeData; // ประกาศที่นี่
    let qrCodePath; // เปลี่ยนชื่อเป็น qrCodePath
    if (paymentMethod === 'promtpay') {
      qrCodeData = generatePayload(phoneNumber, { amount: totalPrice });
      console.log("Generated QR Code Data:", qrCodeData); // Check QR Code data

      // สร้าง QR Code เป็นรูปภาพ
      qrCodePath = path.join(__dirname, 'qrcode.png'); // กำหนด path ของ QR Code
      const qrCodeWidth = 200; // ปรับขนาดให้เหมาะสม
      const qrCodeHeight = 200; // ปรับขนาดให้เหมาะสม
      await QRCode.toFile(qrCodePath, qrCodeData, { errorCorrectionLevel: 'H', width: qrCodeWidth, height: qrCodeHeight }); // ใช้ await ที่นี่เพื่อรอให้การสร้างเสร็จ
      console.log('QR Code generated at:', qrCodePath); // แสดง path ของ QR Code

      // อ่านไฟล์ QR Code และแสดงใน Console
      fs.readFile(qrCodePath, (err, data) => {
        if (err) {
          console.error('Error reading QR code image:', err);
        } else {
          console.log('QR Code image data:', data); // แสดงข้อมูลของ QR Code
        }
      });
      

      receipt.push('------------------------------------------');
      receipt.push('QR Code for Payment:');
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
        printReceipt(receipt, res, qrCodePath); // Pass QR Code path here
      });
    } else {
      receipt.push('------------------------------------------');
      receipt.push('Thank you');
      receipt.push('Please come again soon');
      receipt.push(`Method: ${paymentMethod}`);
      logReceipt(receipt);
      printReceipt(receipt, res, qrCodePath); // Pass QR Code path here
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
function printReceipt(receipt, res, qrCodePath) {
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
    printer.newLine();
    printer.bold(false);
    printer.setTextNormal();
    
    // Print receipt
    receipt.forEach(line => {
      printer.println(line);
    });

    if (qrCodePath) {
      printer.newLine(); // เพิ่มบรรทัดใหม่ก่อนพิมพ์ QR Code
      printer.printImage(qrCodePath, { width: 200, height: 200 }); // กำหนดขนาดพิมพ์ให้เหมาะสม
    }
    
    printer.cut();
    printer.execute();

    console.log("Print done!");
    if (res) {
      res.status(200).json({ message: "Receipt printed successfully." });
    }
  } catch (error) {
    console.error("Print failed:", error);
    if (res) {
      res.status(500).json({ message: "Failed to print receipt.", error });
    }
  }
}

