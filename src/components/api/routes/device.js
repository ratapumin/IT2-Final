const express = require('express');
const { printReceipt,printCloseDaily, printReportSales } = require('../controllers/device');
const router = express.Router();

// Route สำหรับสร้างใบเสร็จ
router.post('/print', printReceipt);
router.post('/printdaily/:date',printCloseDaily)
router.post('/printReportsales/:startDate/:endDate',printReportSales)

module.exports = router;
