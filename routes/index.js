const express = require('express')
const router = express.Router()
const Controller = require('../controllers/controller.js')
const UserController = require('../controllers/userController.js')

const profileRouter = require('./profile')
const postRouter = require('./pop')

const { User, Profile } = require('../models') 

router.use(async (req, res, next) => {
    try {
        const { userId } = req.session

        if (userId) {
            const user = await User.findByPk(userId, {
                include: Profile
            })
            res.locals.currentUser = user 
        } else {
            res.locals.currentUser = null
        }
    } catch (error) {
        console.log(error)
        res.locals.currentUser = null
    }
    next()
})

const isLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        const error = 'Silahkan login terlebih dahulu'
        return res.redirect(`/login?error=${error}`)
    }
    next()
}

router.use('/profile', isLoggedIn, profileRouter)
router.use('/pop', isLoggedIn, postRouter)

router.get('/', Controller.home)
router.get('/hashtags/:tag', isLoggedIn, Controller.showPostsByHashtag)
router.get('/login', UserController.loginForm)
router.post('/login', UserController.postLogin)
router.get('/register', UserController.registerForm)
router.post('/register', UserController.postRegister)
router.get('/logout', UserController.logout)

module.exports = router