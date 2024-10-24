const express = require('express')
const { readTypeSales,readGraphMonthly, readDaily, readMonthly, readYear, topProductMonth, readRepotSales, topProductYear, readOldGraphMonthly } = require('../controllers/sales')
const router = express.Router()

router.get('/typesales/:date', readTypeSales)
router.get('/oldgraphmonthly/:id',readOldGraphMonthly)
router.post('/graphmonthly/:id', readGraphMonthly)
router.get('/daily/:id',readDaily)
router.get('/monthly/:id',readMonthly)
router.get('/year/:id',readYear)
router.get('/topproductmonth/:month',topProductMonth)
router.get('/topproductyear/:year',topProductYear)
router.get('/reportsales/:startDate/:endDate', readRepotSales);


module.exports = router