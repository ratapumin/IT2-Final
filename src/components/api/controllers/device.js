const Printer = require('node-thermal-printer').printer;
const types = require('node-thermal-printer').types;
const conn = require('../db');

exports.printReceipt = (req, res) => {
  const { order_id, order_no, order_date_time, customer, products, history } = req.body;

  const sqlCustomer = `
    SELECT c_fname as firstname, c_lname as lastname, c_points FROM customers WHERE c_id = ?`;

  const sqlProduct = `
    SELECT p_name, p_price FROM products WHERE p_id = ?`;

  let totalEarn = 0; // คะแนนที่ได้รับ
  let totalRedeem = 0; // คะแนนที่ใช้

  // แยกคะแนนที่ได้และที่ใช้
  history.forEach(entry => {
    if (entry.type === 'earn') {
      totalEarn += entry.points; // บวกคะแนนที่ได้รับ
    } else if (entry.type === 'redeem') {
      totalRedeem += entry.points; // บวกคะแนนที่ใช้
    }
  });

  // สร้าง Promise เพื่อดึงข้อมูลผลิตภัณฑ์ทั้งหมด
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

  // ดึงข้อมูลผลิตภัณฑ์ทั้งหมดพร้อมกัน
  Promise.all(productQueries)
    .then(productsData => {
      // คำนวณ subtotal
      const subtotal = productsData.reduce((acc, product) => acc + (product.p_price * product.quantity), 0);

      // คำนวณ discount และ totalPrice
      let discount = totalRedeem ? 5 : 0; // ส่วนลดที่ต้องการ
      const totalPrice = subtotal - discount;

      // สร้างข้อมูลที่จะพิมพ์
      const totalWidth = 40; // กำหนดความกว้างรวมของบรรทัด
      const receipt = [];
      // receipt.push('Khathong Coffee');
      receipt.push(`Emp: Ratapumin   #${order_id}   #${order_no}`.padEnd(totalWidth));
      receipt.push(`Date: ${order_date_time.split(' ')[0]}`.padEnd(totalWidth));
      receipt.push(`Time: ${order_date_time.split(' ')[1]}`.padEnd(totalWidth));
      receipt.push('------------------------------------------');
      receipt.push('Item                   Qty     Amount'); // ปรับความกว้างของคอลัมน์

      productsData.forEach(product => {
        const itemLine = `${product.p_name.padEnd(20)} ${String(product.quantity).padEnd(8)} ${product.p_price * product.quantity}`;
        receipt.push(itemLine);
      });

      receipt.push('------------------------------------------');

      // กำหนดความยาวของแต่ละบรรทัด
      const subtotalLine = `Subtotal:                ${subtotal}`;
      const discountLine = `Discount:                ${discount}`;
      const totalLine = `Total:                   ${totalPrice}`;

      // ใช้ padEnd เพื่อให้ความยาวเท่ากัน
      receipt.push(subtotalLine.padEnd(35));
      receipt.push(discountLine.padEnd(35));
      receipt.push(totalLine.padEnd(35));

      // ตรวจสอบข้อมูลลูกค้า
      if (customer && customer.c_id) {
        const customerId = customer.c_id;

        conn.query(sqlCustomer, [customerId], (error, customerResult) => {
          if (error || customerResult.length === 0) {
            // ไม่พบข้อมูลลูกค้า
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

          // เรียกฟังก์ชันพิมพ์ใบเสร็จ
          printReceipt(receipt, res);
        });
      } else {
        receipt.push('------------------------------------------');
        receipt.push('Thank you');
        receipt.push('Please come again soon');

        // เรียกฟังก์ชันพิมพ์ใบเสร็จ
        printReceipt(receipt, res);

      }
    })
    .catch(error => {
      console.error("Failed to get products:", error);
      res.status(500).json({ message: "Failed to get product details.", error });
    });
};

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
