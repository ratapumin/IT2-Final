const express = require('express')
const { showOrderIs, reprintReceipt, printReceipt } = require('../controllers/reprint')
const router = express.Router()

router.get('/showorderid', showOrderIs)
router.post('/reprintreceipt/:order_id', reprintReceipt)
router.post('/printReceipt/', printReceipt)

module.exports = router