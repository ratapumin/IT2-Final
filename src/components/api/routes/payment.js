const express = require('express')
const { payment, closedaily, pointstype, pointsTypeYear, pointsTypemonthly } = require('../controllers/payment')
const router = express.Router()

router.post('/createOrder', payment)
router.post('/closedaily', closedaily)
router.post('/pointstype/:date', pointstype)
router.post('/pointstypemonthly/:monthly', pointsTypemonthly)
router.post('/pointstypeyear/:year', pointsTypeYear)
module.exports = router