const express = require('express')
const { payment } = require('../controllers/payment')
const router = express.Router()

router.post('/createOrder', payment)

module.exports = router