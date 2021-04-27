const express = require('express')
const router = express.Router()
const {
    addMenu,
    updateMenu,
    deleteMenu,
    getMenu
} = require('../methods/Menu')
router.post('/addMenu', addMenu)
router.patch('/updateMenu/:mobileNumber', updateMenu)
router.delete('/deleteMenu/:mobileNumber', deleteMenu)
router.get('/getMenu/:mobileNumber', getMenu)
module.exports = router