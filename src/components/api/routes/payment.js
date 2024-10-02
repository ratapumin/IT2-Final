const express = require('express')
const { payment, closedaily } = require('../controllers/payment')
const router = express.Router()

router.post('/createOrder', payment)
router.post('/closedaily',closedaily)

module.exports = router