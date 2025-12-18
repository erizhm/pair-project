const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller.js')

router.get('/add', Controller.popForm)
router.post('/add', Controller.postPop)
router.get(':id/delete', Controller.deletePop)

module.exports = router