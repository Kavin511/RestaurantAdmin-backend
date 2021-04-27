const Menu = require('../models/Menu')
const config = require('../config/dbconfig')
const jwt = require('jwt-simple')
exports.addMenu = (req, res) => {
    if (req.body.mobileNumber) {
        const menu = Menu(req.body)
        menu.save().then(() => {
            return res.json({
                msg: "Menu added successfully"
            })
        }).catch((err) => {
            return res.json({
                err: err,
                msg: "enter all fields"
            })
        })
    }
    else {
        res.json({
            msg: "Mobile number required"
        })
    }
}
exports.updateMenu = (req, res) => {
    Menu.findOneAndUpdate({ mobileNumber: req.params.mobileNumber }, {
        $addToSet: {
            foodItems: req.body
        }
    }, { isNew: true }, (err, result) => {
        if (err) {
            res.status(404).send(
                "Error occurred"
            )
        }
        else {
            res.status(200).send({
                result
            })
        }
    })
}
exports.deleteMenu = (req, res) => {
    Menu.findOneAndUpdate(
        { mobileNumber: req.params.mobileNumber },
        { $pull: { foodItems: {foodName:req.body.foodName} } },
        { new: true }, (err, result) => {
            if (err)
                return res.json({
                    err: err
                })
            else
                return res.json(
                    "Deleted successfully !"
                )
        }
    );
}
exports.getMenu = (req, res) => {
    Menu.findOne({ mobileNumber: req.params.mobileNumber }, (err, result) => {
        if (err)
            return res.json({
                err: "Error in finding appropriate menu"
            })
        else
            return res.json({
                result
            })
    })
}
