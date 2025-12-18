const { User, Profile, Post, Hashtag } = require('../models')

class Controller {
    static landingPage(req, res) {
        res.render('landing')
    }

}

module.exports = Controller