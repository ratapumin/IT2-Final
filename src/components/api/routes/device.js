const express = require('express');
const { printReceipt,printCloseDaily } = require('../controllers/device');
const router = express.Router();

// Route สำหรับสร้างใบเสร็จ
router.post('/print', printReceipt);
router.post('/printdaily/:startDate/:endDate',printCloseDaily)

module.exports = router;
