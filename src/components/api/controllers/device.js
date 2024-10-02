const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

// สร้างอินสแตนซ์เครื่องพิมพ์
let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,  // ประเภทเครื่องพิมพ์
  interface: 'usb',          // การเชื่อมต่อ (เช่น usb, network, serial)
});


// ฟังก์ชันสำหรับพิมพ์ใบเสร็จ
exports.printReceipt = async (req, res) => {
    const { items, total } = req.body;

    try {
        // เริ่มต้นการพิมพ์ใบเสร็จ
        printer.println('ใบเสร็จรับเงิน');
        printer.println('--------------------------');

        // พิมพ์รายการสินค้า
        items.forEach(item => {
            printer.println(`${item.name} - ${item.price} บาท`);
        });

        printer.println(`รวม: ${total} บาท`);
        printer.println('ขอบคุณที่ใช้บริการ');
        printer.cut();  // ตัดกระดาษ

        // สั่งพิมพ์
        await printer.execute();
        console.log('พิมพ์ใบเสร็จเสร็จสิ้น');
        return res.status(200).send('พิมพ์ใบเสร็จเสร็จสิ้น');
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการพิมพ์:', err);
        return res.status(500).send('เกิดข้อผิดพลาดในการพิมพ์');
    }
};
