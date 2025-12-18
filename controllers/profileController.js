const { User, Profile, Post, Hashtag } = require('../models')
const formatHashtag = require('../helpers/formatter')

class ProfileController {
   
    static async showProfile(req, res) {
        try {
            const { userId } = req.session
            
            const user = await User.findByPk(userId, {
                include: [
                    { model: Profile },
                    { 
                        model: Post,
                        include: [Hashtag], 
                        order: [['createdAt', 'DESC']] 
                    }
                ]
            })

            res.render('profile/me', { user, formatHashtag })
        } catch (error) {
            res.send(error.message)
        }
    }

    static async editProfile(req, res) {
        try {
            const { userId } = req.session
            
            const profile = await Profile.findOne({
                where: { UserId: userId }
            })

            res.render('profile/edit', { profile, errors: [] })
        } catch (error) {
            res.send(error.message)
        }
    }

    static async updateProfile(req, res) {
        
        const { userId } = req.session
        const { username, bio } = req.body 

        try {

            await Profile.update(
                { username, bio },
                { where: { UserId: userId } }
            )

            res.redirect('/profile') 
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(el => el.message)
                
                res.render('profile/edit', { 
                    errors,
                    profile: { username, bio } 
                })
            } else {
                res.send(error.message)
            }
        }
    }
}

module.exports = ProfileController