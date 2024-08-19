const express = require('express')
const { read } = require('../controllers/order')
const router = express.Router()

router.get('/readorder', read)

module.exports = router