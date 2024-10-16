const express = require('express')
const { showOrderIs,reprintReceipt } = require('../controllers/reprint')
const router = express.Router()

router.get('/showorderid', showOrderIs)
router.post('/reprintreceipt/:order_id', reprintReceipt)

module.exports = router