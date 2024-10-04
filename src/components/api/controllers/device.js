const Printer = require('node-thermal-printer').printer;
const types = require('node-thermal-printer').types;

const printer = new Printer({
    type: types.EPSON,
    interface: '//localhost/printer', // shirnig
    options: {
        timeout: 10000, // เพิ่ม timeout ในการเชื่อมต่อ
    }
});

exports.printReceipt = (req, res) => {
    const { content } = req.body;

    // ตั้งค่าข้อมูลที่จะพิมพ์
    printer.alignCenter();
    printer.println(content);
    // printer.cut();  // ตัดกระดาษหลังจากที่พิมพ์เสร็จ

    // สั่งพิมพ์
    printer.execute()
        .then(() => {
            console.log("Printed and cut successfully.");
            res.status(200).send("Print job sent successfully.");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Failed to print.");
        });
};
