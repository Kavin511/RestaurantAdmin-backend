const express = require('express')
const actions = require('../methods/actions')
const router = express.Router()
var multer=require('multer')
var fs=require('fs')
var path=require('path')
var upload=multer({
    dest:'uploads/'
})
const { model } = require('mongoose')
const profile = require('../models/profile')
const app=express();
router.get('/', (req, res) => {
    res.send(__dirname)
})
router.get('/dashboard', (req, res) => {
    res.send('hello dashboard')
})

router.post('/user/register', actions.addNew)
router.patch('/user/update/:mobileNumber', actions.update)
router.get('/user/getUser/:mobileNumber', actions.getUser)
router.get('/user/getProfile/:mobileNumber',actions.getProfile)
router.post('/authentication', actions.authenticate)
router.put('/personal_details', actions.addProfile)
router.post('/updateDP',actions.addDP)
router.get('/getDP',actions.getDP)
module.exports = router;