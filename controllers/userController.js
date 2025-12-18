const { User } = require('../models')
const bcrypt = require('bcryptjs')

class UserController {
    static registerForm(req, res) {
            res.render('auth/register', { errors: [], input: {} })
        }
    
        static async postRegister(req, res) {
            const { email, password, role } = req.body
            try {
                await User.create({ email, password, role: role || 'User' })
                res.redirect('/login')
            } catch (error) {
                if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                    const errors = error.errors.map(el => el.message)
    
                    res.render('auth/register', {
                        errors,
                        input: req.body
                    })
                } else {
                    res.send(error)
                }
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