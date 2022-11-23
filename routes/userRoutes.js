
const express = require('express')
const router = express.Router()
const authcontroller = require('./../controllers/authControllers')

router.post('/signup', authcontroller.signup)
router.post('/login', authcontroller.login)










module.exports = router