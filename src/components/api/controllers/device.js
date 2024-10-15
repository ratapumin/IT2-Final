const Printer = require('node-thermal-printer').printer;
const types = require('node-thermal-printer').types;
const conn = require('../db');
const generatePayload = require('promptpay-qr');
const fs = require('fs');
const QRCode = require('qrcode');
const path = require('path');


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
    printer.println('Kathong Coffee');
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
  const sqlProduct = `SELECT p_name, p_price,category FROM products WHERE p_id = ?`;

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
          p_category: productData.category,
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
    receipt.push('Item                    Type   Qty   Amount');
    // ใช้การเติมช่องว่างให้ตรงกับแต่ละช่อง
    productsData.forEach(product => {
      const itemLine = `${product.p_name.padEnd(24)} ${product.p_category.padEnd(5)} ${String(product.quantity).padEnd(4)} ${String(product.p_price * product.quantity).padStart(6)}`;
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



//Print close daily
exports.printCloseDaily = (req, res) => {
  const { date } = req.params; // เปลี่ยนจาก req.body เป็น req.params
  console.log('Requested date:', date); // log วันที่ที่ส่งมา

  // คิวรีข้อมูลต่าง ๆ
  const totalSalesQuery = `
      SELECT SUM(order_detail.price * order_detail.quantity) AS total_amount
      FROM orders
      JOIN order_detail ON orders.order_id = order_detail.order_id
      WHERE DATE(orders.order_date_time) = ?`;

  const products = `
                    SELECT order_detail.p_id, products.category, SUM(order_detail.quantity) AS qty, 
                    products.p_name as name, SUM(order_detail.price * order_detail.quantity) as amount, 
                    products.p_price as price      
                    FROM order_detail
                    JOIN orders ON orders.order_id = order_detail.order_id
                    JOIN products ON order_detail.p_id = products.p_id
                    WHERE DATE(orders.order_date_time) = ? 
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
      WHERE DATE(orders.order_date_time) = ? 
      GROUP BY
          order_detail.p_id
      ORDER BY
          total_sales DESC
      LIMIT 5`;

  const sqlPaymentType = `
      SELECT SUM(order_detail.price * order_detail.quantity) AS total_sales, orders.payment_type
      FROM order_detail
      JOIN orders ON order_detail.order_id = orders.order_id
      WHERE DATE(orders.order_date_time) = ? 
      GROUP BY orders.payment_type`;

  const redeemQuery = `
            SELECT 
            COUNT(*) AS redeem_count,
            COALESCE(SUM(5), 0) AS total_redeem_value
          FROM points_history
          WHERE type = 'redeem' AND DATE(transaction_date) = ?`;

  // ดึงยอดขายรวม
  conn.query(totalSalesQuery, [date], (error, totalSalesResults) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // ดึงสินค้าทั้งหมด
    conn.query(products, [date], (error, productsResults) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // ดึงสินค้าขายดี
      conn.query(topProductsQuery, [date], (error, topProductsResults) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        // ดึงข้อมูลยอดขายตามประเภทการชำระเงิน
        conn.query(sqlPaymentType, [date], (error, paymentTypeResults) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }

          // ดึงข้อมูลการใช้ redeem points
          conn.query(redeemQuery, [date], (error, redeemResults) => {
            if (error) {
              return res.status(500).json({ error: error.message });
            }

            // คิวรีข้อมูลล่าสุดจาก closedaily
            const latestCloseDailyQuery = `
                                          SELECT 
                                          DATE_FORMAT(closedaily.date, '%Y-%m-%d') AS date, 
                                          closedaily.cash_in_machine, 
                                          closedaily.cash_in_system, 
                                          closedaily.cash_difference
                                          FROM 
                                              closedaily
                                          ORDER BY 
                                              closedaily.id DESC
                                          LIMIT 1
                                                      `

            // ดึงข้อมูลล่าสุดจาก closedaily
            conn.query(latestCloseDailyQuery, (error, latestCloseDailyResults) => {
              if (error) {
                return res.status(500).json({ error: error.message });
              }

              const receiptContent = generateReceiptContent(totalSalesResults, productsResults, paymentTypeResults, redeemResults, latestCloseDailyResults);

              logReceipt(receiptContent);
              // printDaily(receiptContent, res);
              res.json({
                totalSalesResults,
                productsResults,
                paymentTypeResults,
                redeemResults,
                receiptContent,
                latestCloseDailyResults
              });

            });
          });
        });
      });
    });
  });
};




function generateReceiptContent(totalSalesResults, productsResults, paymentTypeResults, redeemResults, latestCloseDailyResults) {
  const receipt = [];
  const totalSales = totalSalesResults[0]?.total_amount || 0;
  const totalWidth = 40; // กำหนดความกว้างสำหรับการจัดรูปแบบ

  // ตรวจสอบและเพิ่มค่าลงใน receipt
  const dateStr = `Date: ${new Date().toLocaleDateString()}`;
  const timeStr = `Time: ${new Date().toLocaleTimeString()}`;

  if (dateStr) receipt.push(dateStr.padEnd(totalWidth));
  if (timeStr) receipt.push(timeStr.padEnd(totalWidth));
  receipt.push('-----------------------------------------');
  receipt.push(`  *** Sales Summary ***`);

  redeemResults.forEach(redeem => {
    const totalValue = redeem.total_redeem_value !== null ? parseFloat(redeem.total_redeem_value) : 0;
    const grossSalesLabel = 'Gross Sales';
    const discountLabel = 'Discount';
    const netSalesLabel = 'Net Sales';
    const taxLabel = 'Tax';

    const grossSalesValue = totalSales; // ค่าที่ได้จาก totalSales
    const discountValue = totalValue.toFixed(2);
    const saleAfterDiscount = (grossSalesValue - parseFloat(discountValue)).toFixed(2);
    const salesWithoutTax = (saleAfterDiscount / 1.07).toFixed(2); // แยกภาษีออกจากยอดขายสุทธิ (สมมติว่า VAT 7%)
    const taxValue = (saleAfterDiscount - salesWithoutTax).toFixed(2);
    const netSalesValue = (grossSalesValue - parseFloat(discountValue) - parseFloat(taxValue)).toFixed(2);

    // เพิ่มข้อมูลลงใน receipt โดยกำหนดระยะห่าง
    receipt.push(`${grossSalesLabel.padEnd(20)} ${String(grossSalesValue).padStart(10)}`);
    receipt.push(`${discountLabel.padEnd(20)} ${String(discountValue).padStart(10)}`);
    receipt.push(`${netSalesLabel.padEnd(20)} ${String(netSalesValue).padStart(10)}`);
    receipt.push(`${taxLabel.padEnd(20)} ${String(taxValue).padStart(10)}`);
  });

  receipt.push('-----------------------------------------');

  // แสดง Products
  receipt.push('*** Products ***');
  receipt.push('-----------------------------------------');
  receipt.push(' Id    Name                Category  Qty '.padEnd(totalWidth));
  receipt.push('-----------------------------------------');

  productsResults.forEach(item => {
    if (item.p_id && item.name && item.category && item.qty) {
      const id = String(item.p_id).padEnd(4);
      const name = item.name.padEnd(20);
      const category = item.category.padEnd(5);
      const qty = String(item.qty).padStart(3);
      receipt.push(` ${id}  ${name}  ${category}  ${qty} `.padEnd(totalWidth));
    } else {
      console.error('Invalid product item:', item);
    }
  });

  receipt.push(`Total product amount: ${totalSales}`.padEnd(totalWidth));
  receipt.push('-----------------------------------------');

  // เพิ่มข้อมูลการชำระเงิน
  receipt.push('*** Sales by payment type ***');
  receipt.push('-----------------------------------------');
  receipt.push('Payment Type          Total Amount   '.padEnd(totalWidth));

  paymentTypeResults.forEach(payment => {
    if (payment.payment_type && payment.total_sales) {
      const paymentType = payment.payment_type.padEnd(18);
      const amount = payment.total_sales;
      receipt.push(`  ${paymentType}     ${amount}`.padEnd(totalWidth));
    } else {
      console.error('Invalid payment type:', payment);
    }
  });

  receipt.push(`Total Sales by Payment Type: ${totalSales} `.padEnd(totalWidth));
  receipt.push('-----------------------------------------');

  // เพิ่มข้อมูลการใช้ redeem points
  receipt.push('*** Points Usage Information ***');
  receipt.push('-----------------------------------------');
  receipt.push('    Points Redeemed      Discount(Baht)  ');

  redeemResults.forEach(redeem => {
    const redeemCount = redeem.redeem_count || 0;
    const totalValue = redeem.total_redeem_value !== null ? redeem.total_redeem_value : 0;
    const redeemCountStr = String(redeemCount).padStart(10) * 10;
    const totalValueStr = String(totalValue).padStart(10);
    receipt.push(` ${redeemCountStr}        ${totalValueStr}`);
  });

  receipt.push('-----------------------------------------');

  // เพิ่มข้อมูลจาก latestCloseDailyResults
  if (latestCloseDailyResults && latestCloseDailyResults.length > 0) {
    const latestCloseDaily = latestCloseDailyResults[0];
    receipt.push(`*** Close Daily ***`);
    receipt.push('-----------------------------------------');
    receipt.push(`Date: ${latestCloseDaily.date}`.padEnd(totalWidth));

    // จัดข้อความให้ตัวเลขตรงกัน
    const cashInMachineLabel = 'Cash In Machine:';
    const cashInSystemLabel = 'Cash In System:';
    const cashDifferenceLabel = 'Cash Difference:';

    const cashInMachineValue = latestCloseDaily.cash_in_machine.padStart(10);
    const cashInSystemValue = latestCloseDaily.cash_in_system.padStart(10);
    const cashDifferenceValue = latestCloseDaily.cash_difference.padStart(10);

    receipt.push(`${cashInMachineLabel.padEnd(25)}${cashInMachineValue}`.padEnd(totalWidth));
    receipt.push(`${cashInSystemLabel.padEnd(25)}${cashInSystemValue}`.padEnd(totalWidth));
    receipt.push(`${cashDifferenceLabel.padEnd(25)}${cashDifferenceValue}`.padEnd(totalWidth));

    receipt.push('-----------------------------------------');
  }
  receipt.push(`Thank you for using our service`);

  console.log('Total Sales Results:', totalSalesResults);
  console.log('Products Results:', productsResults);
  console.log('Payment Type Results:', paymentTypeResults);
  console.log('Redeem Results:', redeemResults);

  return receipt;
}




async function printDaily(receipt, res) {
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
    printer.println('Kathong Coffee');
    printer.bold(false);
    printer.newLine();

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

    // return res.status(200).json({ message: "Receipt printed successfully." });

  } catch (error) {
    console.error("Print failed:", error);
    return res.status(500).json({ message: "Failed to print receipt.", error });
  }
}







exports.printReportSales = (req, res) => {
  const { startDate, endDate } = req.params;
  const { statusPrint } = req.body;
  console.log(statusPrint)
  // Queries
  const totalSalesQuery = `
        SELECT SUM(order_detail.price * order_detail.quantity) AS total_amount
        FROM orders
        JOIN order_detail ON orders.order_id = order_detail.order_id
        WHERE DATE(orders.order_date_time) BETWEEN ? AND ?`;

  const products = `
                      SELECT order_detail.p_id, products.category, SUM(order_detail.quantity) AS qty, 
                      products.p_name as name, SUM(order_detail.price * order_detail.quantity) as amount, 
                      products.p_price as price      
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
              COALESCE(SUM(5), 0) AS total_redeem_value
            FROM points_history
            WHERE type = 'redeem' AND DATE(transaction_date) BETWEEN ? AND ?`;

  // Add your new SQL query here for monthly report
  const startDateFormatted = `${startDate.substring(0, 7)}`; // Format YYYY-MM
  const endDateFormatted = `${endDate.substring(0, 7)}`;

  const monthlySalesQuery = `
  SELECT DATE_FORMAT(orders.order_date_time, '%Y-%m') AS monthly, 
         SUM(order_detail.price * order_detail.quantity) AS total_price
  FROM order_detail
  JOIN orders
  ON order_detail.order_id = orders.order_id
  WHERE DATE_FORMAT(orders.order_date_time, '%Y-%m') BETWEEN '${startDateFormatted}' AND '${endDateFormatted}'
  GROUP BY monthly
  ORDER BY monthly
  LIMIT 0, 25`;

  const startDateYear = `${startDate.substring(0, 4)}`; // Format YYYY-MM
  const endDateYear = `${endDate.substring(0, 4)}`;
  const yearlySalesQuery = `
  SELECT YEAR(orders.order_date_time) AS year, 
         SUM(order_detail.price * order_detail.quantity) AS total_price
  FROM order_detail
  JOIN orders ON order_detail.order_id = orders.order_id
  WHERE YEAR(orders.order_date_time) BETWEEN '${startDateYear}' AND '${endDateYear}'
  GROUP BY YEAR(orders.order_date_time)`;

  // Fetch total sales
  conn.query(totalSalesQuery, [startDate, endDate], (error, totalSalesResults) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Fetch all products
    conn.query(products, [startDate, endDate], (error, productsResults) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Fetch top products
      conn.query(topProductsQuery, [startDate, endDate], (error, topProductsResults) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        // Fetch sales by payment type
        conn.query(sqlPaymentType, [startDate, endDate], (error, paymentTypeResults) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }

          // Fetch redeem points data
          conn.query(redeemQuery, [startDate, endDate], (error, redeemResults) => {
            if (error) {
              return res.status(500).json({ error: error.message });
            }

            // Fetch monthly sales data
            conn.query(monthlySalesQuery, (error, monthlySalesResults) => {
              if (error) {
                return res.status(500).json({ error: error.message });
              }

              conn.query(yearlySalesQuery, [startDate, endDate], (error, yearlySalesResults) => {
                if (error) {
                  return res.status(500).json({ error: error.message });
                }
                // Use the fetched data
                const receiptContent = generateReportContent(
                  totalSalesResults,
                  productsResults,
                  topProductsResults,
                  paymentTypeResults,
                  redeemResults,
                  monthlySalesResults, // Add monthlySalesResults here
                  yearlySalesResults
                );

                // Send or log the report
                res.json({
                  totalSalesResults,
                  productsResults,
                  topProductsResults,
                  paymentTypeResults,
                  redeemResults,
                  monthlySalesResults, // Add monthlySalesResults here
                  yearlySalesResults
                });
                if (statusPrint === 'print') {
                  printDaily(receiptContent, res)
                }
              });
            });
          });
        });
      });
    });
  });
};

const generateReportContent = (
  totalSalesResults,
  productsResults,
  topProductsResults,
  paymentTypeResults,
  redeemResults,
  monthlySalesResults, // รับค่า monthlySalesResults เข้ามา
  yearlySalesResults // รับค่า yearlySalesResults เข้ามา
) => {
  const receipt = [];
  const totalWidth = 40; // กำหนดความกว้างสำหรับการจัดรูปแบบ
  const totalSales = totalSalesResults[0]?.total_amount || 0;

  // เพิ่มวันที่และเวลาในใบเสร็จ
  const dateStr = `Date: ${new Date().toLocaleDateString()}`;
  const timeStr = `Time: ${new Date().toLocaleTimeString()}`;

  if (dateStr) receipt.push(dateStr.padEnd(totalWidth));
  if (timeStr) receipt.push(timeStr.padEnd(totalWidth));
  receipt.push('-----------------------------------------');
  receipt.push(`  *** Sales Summary ***`);

  // คำนวณและเพิ่มยอดขายสุทธิพร้อมภาษี
  redeemResults.forEach(redeem => {
    const totalValue = redeem.total_redeem_value !== null ? parseFloat(redeem.total_redeem_value) : 0;
    const grossSalesLabel = 'Gross Sales';
    const discountLabel = 'Discount';
    const netSalesLabel = 'Net Sales';
    const taxLabel = 'Tax';

    const grossSalesValue = totalSales; // ค่าที่ได้จาก totalSales
    const discountValue = totalValue.toFixed(2);
    const saleAfterDiscount = (grossSalesValue - parseFloat(discountValue)).toFixed(2);
    const salesWithoutTax = (saleAfterDiscount / 1.07).toFixed(2); // แยกภาษีออกจากยอดขายสุทธิ (สมมติว่า VAT 7%)
    const taxValue = (saleAfterDiscount - salesWithoutTax).toFixed(2);
    const netSalesValue = (grossSalesValue - parseFloat(discountValue) - parseFloat(taxValue)).toFixed(2);

    // เพิ่มข้อมูลลงใน receipt โดยกำหนดระยะห่าง
    receipt.push(`${grossSalesLabel.padEnd(20)} ${String(grossSalesValue).padStart(10)}`);
    receipt.push(`${discountLabel.padEnd(20)} ${String(discountValue).padStart(10)}`);
    receipt.push(`${netSalesLabel.padEnd(20)} ${String(netSalesValue).padStart(10)}`);
    receipt.push(`${taxLabel.padEnd(20)} ${String(taxValue).padStart(10)}`);
  });

  receipt.push('-----------------------------------------');

  // แสดงยอดขายในแต่ละเดือน
  receipt.push('         Monthly Sales Summary           '.padEnd(totalWidth));
  receipt.push('-----------------------------------------');
  receipt.push('Month           Total Sales'.padEnd(totalWidth));
  monthlySalesResults.forEach(monthly => {
    const monthLine = `${monthly.monthly.padEnd(15)} ${String(monthly.total_price).padStart(10)} THB`;
    receipt.push(monthLine.padEnd(totalWidth));
  });
  receipt.push('-----------------------------------------');

  // แสดงยอดขายในแต่ละปี
  receipt.push('         Yearly Sales Summary            '.padEnd(totalWidth));
  receipt.push('-----------------------------------------');
  receipt.push('Year            Total Sales'.padEnd(totalWidth));
  yearlySalesResults.forEach(yearly => {
    const yearlyLine = `${yearly.year.toString().padEnd(15)} ${String(yearly.total_price).padStart(10)} THB`;
    receipt.push(yearlyLine.padEnd(totalWidth));
  });
  receipt.push('-----------------------------------------');

  // แสดงรายการสินค้า
  receipt.push('Item                Type   Qty   Amount'.padEnd(totalWidth));
  receipt.push('-----------------------------------------');
  productsResults.forEach(product => {
    const itemLine = `${product.name.padEnd(18)} ${product.category.padEnd(6)} ${String(product.qty).padStart(3)}   ${String(product.amount).padStart(7)}`;
    receipt.push(itemLine.padEnd(totalWidth));
  });
  receipt.push('-----------------------------------------');

  // แสดง 5 สินค้าที่ขายดีที่สุด
  receipt.push('              Top 5 Products              '.padEnd(totalWidth));
  receipt.push('-----------------------------------------');
  receipt.push('Item                Qty   Total Sales'.padEnd(totalWidth));
  topProductsResults.forEach(product => {
    const topItemLine = `${product.Product_Name.padEnd(18)} ${String(product.quantity).padStart(3)}   ${String(product.total_sales).padStart(10)}`;
    receipt.push(topItemLine.padEnd(totalWidth));
  });
  receipt.push('-----------------------------------------');

  // แสดงยอดขายตามประเภทการชำระเงิน
  receipt.push('      Sales Breakdown by Payment Type     '.padEnd(totalWidth));
  receipt.push('-----------------------------------------');
  paymentTypeResults.forEach(paymentType => {
    const paymentLine = `${paymentType.payment_type.padEnd(18)}   ${String(paymentType.total_sales).padStart(10)}`;
    receipt.push(paymentLine.padEnd(totalWidth));
  });
  receipt.push('-----------------------------------------');

  // แสดงข้อมูลการใช้คะแนน
  receipt.push('          Redeem Points Information       '.padEnd(totalWidth));
  receipt.push('-----------------------------------------');
  receipt.push(`Total Redeems:     ${redeemResults[0].redeem_count * 10}`.padEnd(totalWidth));
  receipt.push(`Total Redeem Value: ${redeemResults[0].total_redeem_value} THB`.padEnd(totalWidth));
  receipt.push('-----------------------------------------');

  return receipt;
};
