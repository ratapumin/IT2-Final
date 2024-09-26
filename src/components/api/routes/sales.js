const express = require('express')
const { readTypeSales,readGraphMonthly, readDaily, readMonthly, readYear, topProductMonth, readRepotSales, topProductYear } = require('../controllers/sales')
const router = express.Router()

router.get('/typesales', readTypeSales)
router.get('/graphmonthly', readGraphMonthly)
router.get('/daily/:id',readDaily)
router.get('/monthly/:id',readMonthly)
router.get('/year/:id',readYear)
router.get('/topproductmonth/:month',topProductMonth)
router.get('/topproductyear/:year',topProductYear)
router.get('/reportsales/:startDate/:endDate', readRepotSales);


module.exports = router