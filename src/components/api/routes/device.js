const express = require('express');
const { printReceipt } = require('../controllers/device');
const router = express.Router();

// Route สำหรับสร้างใบเสร็จ
router.post('/print', printReceipt);

module.exports = router;
