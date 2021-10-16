const User = require('../models/user')
const Menu = require('../models/Menu')
const Profile = require('../models/profile')
var config = require('../config/dbconfig')
const jwt = require('jwt-simple')
exports.register = (req, res) => {
    const user = User(
        req.body
    );
    user.save().then(() => {
        var token = jwt.encode(req.body, config.secret)
        const menu = Menu({
            mobileNumber: req.body.mobileNumber,
            foodItems: [],
        })
        menu.save().then(() => {
            const profile = Profile(
                req.body
            );
            profile.save().then(() => {
                res.send({success:true, msg: token })
            })
        })        
    }).catch((err) => {
        res.status(err.status).json({
            success:false,
            msg:err
        });
    });
},
    exports.login = (req, res) => {
        User.findOne({
            mobileNumber: req.body.mobileNumber
        }, (err, user) => {
            if (err) {
                throw err
            }
            if (!user) {
                res.status(err.status).send({
                    success: false,
                    msg: 'Failed to authenticate,User not found' + req.body.mobileNumber
                })
            }
            else {
                user.comparePassword(req.body.password, (err, isMatch) => {
                    if (isMatch && !err) {
                        var token = jwt.encode(user, config.secret)
                        res.json({
                            success: true,
                            msg: token
                        })
                    }
                    else {
                        res.status(err.status).send({
                            success: false,
                            msg: 'Failed to authenticate, wrong password'
                        })
                    }
                })
            }
        })
    },
    exports.userInfo = (req, res) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)
            return res.json({
                success: true, msg: 'Hello' + decodedtoken.mobileNumber
            })
        }
        else {
            return res.json({
                success: false, msg: 'No headers'
            })
        }
    },
    exports.updateUser = (req, res) => {
        User.findOneAndUpdate({ _id: req.params._id }, {
            $set: {
                email: req.body.email ? req.body.email : User.email,
                mobileNumber: req.body.mobileNumber ? req.body.mobileNumber : User.mobileNumber,
            }
        }, (err, user) => {
            if (err)
                res.status(err.status).json({
                    err: err
                })
            else {
                Profile.findOneAndUpdate({ mobileNumber: user.mobileNumber }, {
                    $set: {
                        email: req.body.email ? req.body.email : User.email,
                        mobileNumber: req.body.mobileNumber ? req.body.mobileNumber : User.mobileNumber,
                    }
                })
            }
        })
    }
