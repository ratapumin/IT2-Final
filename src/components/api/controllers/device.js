const Printer = require('node-thermal-printer').printer;
const types = require('node-thermal-printer').types;

const printer = new Printer({
  type: types.EPSON,
  interface: '//localhost/printer', // sharing
  options: {
    timeout: 10000, // เพิ่ม timeout ในการเชื่อมต่อ
  }
});

exports.printReceipt = (req, res) => {
  const { content } = req.body;

  // ตั้งค่าข้อมูลที่จะพิมพ์
  printer.alignCenter();
  printer.bold(true);
  printer.println('Khathong Coffee');
  // printer.println(' ')
  printer.newLine();
  printer.bold(false);
  printer.table(["Emp Ratapumin", "#12345", "#01"]);
  printer.print('Date:2024-10-04')
  printer.print('                 ') // 17 space
  printer.println('Time:15:30')
  // printer.table(["Date:2024-10-04", "", "Time:15:30"]);
  printer.println('------------------------------------------');


  printer.table(["Item", "Qty", "Amount"]);
  printer.table(["Americano", "2", "60"]);
  printer.table(["Espesso", "1", "30"]);
  printer.table(["Thai Tea", "2", "50"]);
  printer.println('------------------------------------------');
  printer.table(["Subtotal: ", "", "140"]);
  printer.table(["Discount:", "", "10"]);
  printer.table(["Total", "", "130"]);
  printer.println('------------------------------------------');
  printer.table(["Customer", "", "Thitima"]);
  printer.println('*** Point ***')
  printer.newLine();
  // printer.table(["Collect", "", "4"]);
  // printer.table(["Redeem", "", "10"]);
  // printer.table(["Total", "", "5"]);
  // printer.leftRight("Collect", "4");
  // printer.leftRight("Redeem", "10");
  // printer.leftRight("Total", "Total");
  // printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
  //   { text: "Collect", align: "LEFT", width: 0.25 },
  //   { text: "4", align: "CENTER", width: 0.25 }
  // ]);
  // printer.newLine();

  // printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
  //   { text: "Redeem", align: "LEFT", width: 0.25 },
  //   { text: "10", align: "CENTER", width: 0.25 }
  // ]);
  // printer.newLine();

  // printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
  //   { text: "Total", align: "LEFT", width: 0.25 },
  //   { text: "130", align: "CENTER", width: 0.25 }
  // ]);
  printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
    { text: "Collect 4", align: "LEFT", width: 0.2 },
    { text: "Redeem 10", align: "CENTER", width: 0.2 },
    { text: "Total 11", align: "RIGHT" }
  ]);
  printer.println('------------------------------------------');

  printer.println('Thank you') // 17 space
  printer.println('Please come again soon') // 17 space
  printer.println(content);
  printer.raw(Buffer.from([0x1B, 0x33, 0x30])); // ตั้งค่าระยะห่างระหว่างบรรทัดเป็น 10 จุด

  printer.cut();

  // สั่งพิมพ์
  try {
    printer.execute()
    console.log("Print done!");
  } catch (error) {
    console.error("Print failed:", error);
  }
};
