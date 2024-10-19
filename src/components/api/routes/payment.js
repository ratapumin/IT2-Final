const express = require('express')
const { payment, closedaily, pointstype } = require('../controllers/payment')
const router = express.Router()

router.post('/createOrder', payment)
router.post('/closedaily', closedaily)
router.post('/pointstype/:date', pointstype)

module.exports = router