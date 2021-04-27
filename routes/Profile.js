const express = require('express')
const router = express.Router()
const {
    getProfile,
    addProfile,
    updateDP,
    updateCover,
    updateProfile,
} = require('../methods/Profile')
router.get('/getProfile/:mobileNumber', getProfile)
router.post('/addProfile/:mobileNumber', addProfile)
router.patch('/updateDP/:mobileNumber',updateDP)
router.patch('/updatecover/:mobileNumber',updateCover)
router.patch('/updateprofile/:mobileNumber',updateProfile)
module.exports=router