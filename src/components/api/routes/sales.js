const express = require('express')
const { readTypeSales,readGraphMonthly, readDaily, readMonthly, readYear } = require('../controllers/sales')
const router = express.Router()

router.get('/typesales', readTypeSales)
router.get('/graphmonthly', readGraphMonthly)
router.get('/daily/:id',readDaily)
router.get('/monthly/:id',readMonthly)
router.get('/year/:id',readYear)

module.exports = router