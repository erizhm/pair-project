const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller.js')

router.get('/', Controller.showProfile)
router.get('/edit', Controller.editProfile)
router.post('/edit', Controller.updateProfile)

module.exports = router