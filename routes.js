

const passport = require('passport')
const passportService = require('./service/passport')
const requireSignin = passport.authenticate('local', { session: false })
const requireAuth = passport.authenticate('jwt', { session: false })
const users = require('./controllers/Users')
const Register = require('./controllers/Register/Register')




// const MailSend = require('./controllers/MailSend/Index')




module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send("<h1 style='text-align:center;margin-top:150px; '>queue Api</h1>")
    })
    app.post('/signin', requireSignin, users.signin)


    app.post('/add-register',Register.create)
    app.get('/get-register-cid/:cid',Register.getCid)
   
















}
