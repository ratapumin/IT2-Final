const express = require('express')
const { list } = require('../controllers/member')
const router = express.Router()

router.get('/members', list)

module.exports = router
