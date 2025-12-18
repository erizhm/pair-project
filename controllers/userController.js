const { User, Profile } = require('../models')
const bcrypt = require('bcryptjs')

class UserController {
    static registerForm(req, res) {
        res.render('auth/register', { errors: [], input: {} })
    }

    static async postRegister(req, res) {
        const { email, password, role, username } = req.body

        let newUser = null;

        try {
            newUser = await User.create({ email, password, role: role || 'User' })

            await Profile.create({
                username: username,
                UserId: newUser.id
            })

            res.redirect('/login')
        } catch (error) {
            
            if (newUser) {
                await newUser.destroy()
            }

            let errors = []

            if (!username) {
                errors.push('Username harus diisi')
            }

            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const sequelizeErrors = error.errors.map(el => el.message)
                errors = errors.concat(sequelizeErrors)
            } else {
                if (errors.length === 0) return res.send(error.message)
            }

            res.render('auth/register', {
                errors,
                input: req.body
            })
        }
    }

    static loginForm(req, res) {

        res.render('auth/login', { errors: [], input: {} })
    }

    static async postLogin(req, res) {
        const { email, password } = req.body

        try {
            const user = await User.findOne({ where: { email } })

            const invalidMsg = ['Email atau Password salah']

            if (!user) {
                return res.render('auth/login', {
                    errors: invalidMsg,
                    input: { email }
                });
            }

            const isValidPassword = bcrypt.compareSync(password, user.password)
            if (!isValidPassword) {
                return res.render('auth/login', {
                    errors: invalidMsg,
                    input: { email }
                });
            }

            req.session.userId = user.id
            req.session.role = user.role
            res.redirect('/')

        } catch (error) {
            res.send(error.message)
        }
    }

    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) console.log(err)
            res.redirect('/login')
        });
    }


}

module.exports = UserController