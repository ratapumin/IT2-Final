const express = require('express')
const { readSales,readMonthly } = require('../controllers/sales')
const router = express.Router()

router.get('/sales', readSales)
router.get('/monthly', readMonthly)

module.exports = router