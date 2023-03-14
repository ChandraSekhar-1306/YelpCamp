const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const users = require('../controllers/authController')
const catchAsync = require('../utils/catchAsync')

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.createUser))

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.loginUser)


router.get('/logout', users.logoutUser)

module.exports = router















