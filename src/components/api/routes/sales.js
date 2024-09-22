const express = require('express')
const { readTypeSales,readGraphMonthly, readDaily, readMonthly, readYear, topProduct, readRepotSales } = require('../controllers/sales')
const router = express.Router()

router.get('/typesales', readTypeSales)
router.get('/graphmonthly', readGraphMonthly)
router.get('/daily/:id',readDaily)
router.get('/monthly/:id',readMonthly)
router.get('/year/:id',readYear)
router.get('/topproduct',topProduct)
router.get('/reportsales/:startDate/:endDate', readRepotSales);


module.exports = router