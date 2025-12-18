const session = require('express-session')
const express = require('express')
const app = express()
const port = 3000
const router = require('./routes')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended:true }))

app.use(session({
  secret: 'pap pip pop',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: true 
  } 
}))

app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
