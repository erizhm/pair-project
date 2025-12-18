const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller.js')
const UserController = require('../controllers/userController.js')
// const profileRouter = require('./profile')
// const postRouter = require('./pop')

// router.use('/profile', profileRouter)
// router.use('/pop', postRouter)

router.get('/login', UserController.loginForm)
router.post('/login', UserController.postLogin)
router.get('/register', UserController.registerForm)
router.post('/register', UserController.postRegister)
// router.get('/logout', Controller.loginForm)
router.get('/', Controller.landingPage)

module.exports = router