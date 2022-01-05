const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))

mongoose.connect('mongodb+srv://tshermor:tshermor_23@cluster0.y21dn.mongodb.net/AngYU?retryWrites=true&w=majority', {
  useNewUrlParser: true
}).then(con => console.log('DB connection successful'))

const userSchema = {
  email: String,
  password: String
}

const User = mongoose.model('User', userSchema)

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save(err => {
    if (err) {
      console.log(err)
    } else {
      res.render('secrets')
    }
  })
})

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.username }, (err, foundUser) => {
    if (err) { console.log(err) }
    else {
      if (foundUser) {
        if (foundUser.password === req.body.password) {
          res.render('secrets')
        }
        else res.status(404).json({ "msg": "wrong password!" })
      }
      else {
        res.status(404).json({ "msg": "user not registered" })
      }
    }
  })
})


app.listen(3000, () => console.log("Listening on port 3000.."));