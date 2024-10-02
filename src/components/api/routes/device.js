const express = require('express')
const { printReceipt } = require('../controllers/device')
const router = express.Router()

router.post('/createreceipt', printReceipt)

module.exports = router