const express = require('express')
const router = express.Router()
const ProfileController = require('../controllers/profileController.js')

router.get('/', ProfileController.showProfile)
router.get('/edit', ProfileController.editProfile)
router.post('/edit', ProfileController.updateProfile)

module.exports = router