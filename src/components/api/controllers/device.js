const Printer = require('node-thermal-printer').printer;
const types = require('node-thermal-printer').types;
const conn = require('../db');
const generatePayload = require('promptpay-qr');
const fs = require('fs');
const QRCode = require('qrcode');
const path = require('path');

const printer = new Printer({
  type: types.EPSON,
  interface: '//localhost/printer',
  options: {
    timeout: 10000,
  }
});

function logReceipt(receipt) {
  console.log("Receipt:\n", receipt.join('\n'));
}

async function printReceipt(receipt, res, qrCodePath) {


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

exports.printCloseDaily = (req, res) => {
  const { startDate, endDate } = req.params;

  // คิวรีข้อมูลต่าง ๆ
  const totalSalesQuery = `
      SELECT SUM(order_detail.price * order_detail.quantity) AS total_amount
      FROM orders
      JOIN order_detail ON orders.order_id = order_detail.order_id
      WHERE DATE(orders.order_date_time) BETWEEN ? AND ?`;

  const products = `
      SELECT order_detail.p_id, SUM(order_detail.quantity) AS qty, products.p_name as name, SUM(order_detail.price * order_detail.quantity) as amount, products.p_price as price
      FROM order_detail
      JOIN orders ON orders.order_id = order_detail.order_id
      JOIN products ON order_detail.p_id = products.p_id
      WHERE DATE(orders.order_date_time) BETWEEN ? AND ?
      GROUP BY order_detail.p_id
      ORDER BY p_id ASC`;

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

  const sqlPaymentType = `
      SELECT SUM(order_detail.price * order_detail.quantity) AS total_sales, orders.payment_type
      FROM order_detail
      JOIN orders ON order_detail.order_id = orders.order_id
      WHERE DATE(orders.order_date_time) BETWEEN ? AND ?
      GROUP BY orders.payment_type`;

  const redeemQuery = `
     SELECT 
     COUNT(*) AS redeem_count,
     SUM(5) AS total_redeem_value
      FROM points_history
      WHERE type = 'redeem' AND DATE(transaction_date) BETWEEN ? AND ?;`;

  // ดึงยอดขายรวม
  conn.query(totalSalesQuery, [startDate, endDate], (error, totalSalesResults) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // ดึงสินค้าทั้งหมด
    conn.query(products, [startDate, endDate], (error, productsResults) => {
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

            // สร้างเนื้อหาจากข้อมูลที่ดึงมา
            const receipt = [];
            const totalSales = totalSalesResults[0].total_amount || 0; // ตรวจสอบยอดขายรวม

            // หัวข้อ
            // ...โค้ดก่อนหน้านี้
            receipt.push('Khathong Coffee');
            receipt.push(`Date: ${new Date().toLocaleDateString()}`);
            receipt.push(`Time: ${new Date().toLocaleTimeString()}`);
            receipt.push(`Total Sales: ${totalSales} บาท`);
            receipt.push('-------------------------------');
            receipt.push('*** Products ***');
            receipt.push('---------------------------------');
            receipt.push('| Id   | Name                | Qty |'); // แก้ไขให้คอลัมน์ Name มีความกว้างที่เหมาะสม
            receipt.push('|------|---------------------|-----|'); // แก้ไขให้คอลัมน์ Name มีความกว้างที่เหมาะสม

            // เพิ่มข้อมูลรายการสินค้า
            productsResults.forEach(item => {
              receipt.push(` ${String(item.p_id).padEnd(4)}  ${item.name.padEnd(20)}  ${String(item.qty).padStart(3)} `); // ใช้ padStart สำหรับ Qty
            });

            receipt.push('---------------------------------');
            receipt.push(`รวมยอดสินค้า: ${totalSales} บาท`);
            receipt.push('-------------------------------');
            receipt.push('ยอดขายตามประเภทการชำระเงิน:');
            receipt.push('---------------------------------');
            receipt.push('| ประเภทการชำระเงิน | ยอดรวม  |');
            paymentTypeResults.forEach(payment => {
              receipt.push(`| ${payment.payment_type.padEnd(18)} | ${payment.total_sales}  |`);
            });
            receipt.push('---------------------------------');
            receipt.push(`รวมยอดขายตามประเภทการชำระเงิน: ${totalSales} บาท`);
            receipt.push('-------------------------------');
            receipt.push('ข้อมูลการใช้คะแนน:');
            receipt.push('---------------------------------');
            receipt.push('| จำนวนการใช้คะแนน | มูลค่ารวม  |');
            redeemResults.forEach(redeem => {
              receipt.push(`| ${redeem.redeem_count.toString().padEnd(18)} | ${redeem.total_redeem_value || 'ไม่มีคะแนน'} |`);
            });
            receipt.push('---------------------------------');
            receipt.push('ขอบคุณที่ใช้บริการ!');

            // ส่งข้อมูลผลลัพธ์ทั้งหมดกลับไป
            res.json({
              totalSales: totalSalesResults[0],
              products: productsResults,
              topProducts: topProductsResults,
              paymentTypes: paymentTypeResults,
              redeemPoints: redeemResults,
              receipt: receipt // ส่งใบเสร็จกลับไปด้วย
            });


            // พิมพ์ใบเสร็จ
            // printDaily(receipt, res);
          });
        });
      });
    });
  });
};

async function printDaily(receipt, res) {
  try {
    printer.alignCenter();
    printer.bold(true);
    printer.setTextQuadArea(0, 0, 1, 1);
    printer.println('Khathong Coffee');
    printer.bold(false);
    printer.newLine();
    printer.setTextNormal();

    // พิมพ์ใบเสร็จ
    receipt.forEach(line => {
      printer.println(line);
    });

    printer.cut();
    await printer.execute();

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