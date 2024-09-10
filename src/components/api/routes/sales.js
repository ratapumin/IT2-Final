const express = require('express')
const { readSales } = require('../controllers/sales')
const router = express.Router()

router.get('/sales', readSales)

module.exports = router