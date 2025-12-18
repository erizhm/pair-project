const { User, Profile, Post, Hashtag } = require('../models')
const formatHashtag = require('../helpers/formatter')
const { Op } = require('sequelize')

class Controller {

    static async home(req, res) {
        try {
            const { userId } = req.session

            if (!userId) {
                return res.render('landing')
            }

            const { search } = req.query

            let option = {
                include: [
                    {
                        model: User,
                        include: [Profile]
                    },
                    { model: Hashtag }
                ],
                order: [['createdAt', 'DESC']]
            }

            if (search) {
                option.where = {
                    content: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            }

            const posts = await Post.findAll(option)

            const currentUser = await User.findByPk(userId, {
                include: Profile
            })

            res.render('home', {
                posts,
                currentUser,
                formatHashtag: require('../helpers/formatter'),
                search
            })

        } catch (error) {
            console.log(error);
            res.send(error.message)
        }
    }

    static async showPostsByHashtag(req, res) {
        try {
            const { tag } = req.params 
            const { userId } = req.session

            const data = await Hashtag.findOne({
                where: { 
                    name: { [Op.iLike]: `#${tag}` } 
                },
                include: {
                    model: Post,
                    include: [
                        { model: User, include: { model: Profile } },
                        { model: Hashtag }
                    ]
                },
                order: [[ Post, 'createdAt', 'DESC' ]] 
            })

            const currentUser = await User.findByPk(userId, {
                include: Profile
            })

            const posts = data ? data.Posts : []

            res.render('home', {
                posts,
                currentUser,
                formatHashtag,
                search: null
            })

        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

}

module.exports = Controller