const express = require('express')
const router = express.Router()
const {
    register,
    login,
    userInfo,
    updateUser,
} = require('../methods/Auth')
router.post('/register', register)
router.post('/login', login)
router.get('/getInfo', userInfo)
router.patch('/updateUser/:_id', updateUser)
module.exports=router