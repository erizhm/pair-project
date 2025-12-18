const { User, Profile, Post, Hashtag } = require('../models')

class PopController {

    static formAddPop(req, res) {
        res.render('addPop', { errors: [], input: {} })
    }

    static async postAddPop(req, res) {
        const { content } = req.body
        const { userId } = req.session

        let picturePath = null

        if (req.file) {
            picturePath = `/uploads/${req.file.filename}`
        }

        try {
            const newPost = await Post.create({
                content,
                picture: picturePath,
                UserId: userId
            })

            const hashtags = content.match(/#[a-z0-9_]+/gi)

            if (hashtags) {

                const lowerCaseTags = hashtags.map(tag => tag.toLowerCase());

                const uniqueTags = [...new Set(lowerCaseTags)];

                for (let tag of uniqueTags) {
                    const [tagDb, created] = await Hashtag.findOrCreate({
                        where: { name: tag },
                        defaults: { name: tag }
                    })


                    await newPost.addHashtag(tagDb)
                }
            }
            res.redirect('/')
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(el => el.message)

                res.render('addPop', {
                    errors,
                    input: req.body
                })
            } else {
                res.send(error.message)
            }
        }
    }

    static async editPopForm(req, res) {
        try {
            const { id } = req.params
            const { userId } = req.session

            const post = await Post.findByPk(id)

            if (!post) return res.redirect('/?error=Post tidak ditemukan')

            if (post.UserId !== userId) {
                return res.redirect('/?error=Anda tidak berhak mengedit post ini')
            }

            res.render('editPop', { post })

        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async updatePop(req, res) {
        try {
            const { id } = req.params
            const { userId } = req.session
            const { content } = req.body

            const post = await Post.findByPk(id)

            if (!post) return res.redirect('/?error=Post tidak ditemukan')
            if (post.UserId !== userId) return res.redirect('/?error=Dilarang edit punya orang lain')

            let updateData = { content }

            if (req.file) {
                updateData.picture = `/uploads/${req.file.filename}`
            }

            await Post.update(
                updateData,
                { where: { id } }
            )

            res.redirect('/')
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

    static async deletePop(req, res) {
        try {
            const { id } = req.params
            const { userId } = req.session

            const post = await Post.findByPk(id)

            const userRight = await User.findByPk(userId)

            if (!post) {
                return res.redirect('/?error=Post tidak ditemukan')
            }

            if (post.UserId !== userId && userRight.role !== 'Admin') {
                return res.redirect('/?error=Kamu tidak berhak menghapus post ini')
            }

            await Post.destroy({
                where: { id }
            })

            res.redirect('/')
        } catch (error) {
            console.log(error)
            res.send(error.message)
        }
    }

}

module.exports = PopController