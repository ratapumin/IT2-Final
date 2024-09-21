const express = require('express')
const { list, createMembers, deleteMembers, updateMembers } = require('../controllers/member')
const router = express.Router()

router.get('/members', list)
router.post('/members', createMembers)
router.put('/members/:id',updateMembers)
router.delete('/members/:id',deleteMembers)

module.exports = router
