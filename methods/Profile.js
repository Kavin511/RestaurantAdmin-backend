const Profile = require('../models/profile')
var config = require('../config/dbconfig')
var multer = require('multer')
var fs = require('fs')
var grid = require('gridfs-stream')
var formidable = require('formidable')
const jwt = require('jwt-simple')
var mongoose = require("mongoose");
exports.getProfile = (req, res) => {
    Profile.findOne({ mobileNumber: req.params.mobileNumber }, (err, result) => {
        if (err) {
            res.status(404).send({
                msg: "No profile",
                err
            })
        }
        else {
            
            res.json({
                result
            })
        }
    })
}
exports.addProfile = (req, res) => {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (!err) {
            if (files.cover && files.dp) {
                if (files.dp.size > 3000000 || files.cover.size > 3000000) {
                    return res.status(400).json({
                        error: 'File Size is to Big',
                    });
                }
                else {
                    const profile = Profile({
                        mobileNumber: req.params.mobileNumber,
                        hotelName: fields.hotelName,
                        address: fields.address,
                        location:
                        {
                            coordinates: [
                                fields.latitude,
                                fields.longitude
                            ]
                        },
                        cover: {
                            data: fs.readFileSync(files.cover.path)
                        },
                        DP: {
                            data: fs.readFileSync(files.dp.path)
                        }
                    })
                    profile.save().then(() => {
                        return res.json({
                            msg: "Profile Saved successfully!",


                        })
                    }).catch((err) => {
                        return res.status(400).json({
                            err: err,
                            msg: "Error on cover ,dp"
                        })
                    })
                }
            }
            else if (files.dp) {
                const profile = Profile({
                    mobileNumber: req.params.mobileNumber,
                    hotelName: fields.hotelName,
                    address: fields.address,
                    location:
                    {
                        coordinates: [
                            fields.latitude,
                            fields.longitude
                        ]
                    },
                    DP: {
                        data: fs.readFileSync(files.dp.path)
                    }
                })
                profile.save().then(() => {
                    return res.json({
                        msg: "Profile Saved successfully! with dp",

                    })
                }).catch((err) => {
                    return res.status(400).json({
                        err: err,
                        msg: "Error on dp"
                    })
                })
            }
            else if (files.cover) {
                const profile = Profile({
                    mobileNumber: req.params.mobileNumber,
                    hotelName: fields.hotelName,
                    address: fields.address,
                    location:
                    {
                        coordinates: [
                            fields.latitude,
                            fields.longitude
                        ]
                    },
                    cover: {
                        data: fs.readFileSync(files.cover.path)
                    },
                })
                profile.save().then(() => {
                    return res.json({
                        msg: "Profile Saved successfully! with cover photo",

                    })
                }).catch((err) => {
                    return res.status(400).json({
                        err: err,
                        msg: "Error on cover "
                    })
                })
            }
            else {
                const profile = Profile({
                    mobileNumber: req.params.mobileNumber,
                    hotelName: "fields.hotelName",
                    address: fields.address,
                    location:
                    {
                        coordinates: [
                            fields.latitude,
                            fields.longitude
                        ]
                    },
                })
                profile.save().then(() => {
                    return res.json({
                        msg: "Profile Saved successfully! without images",

                    })
                }).catch((err) => {
                    return res.status(400).json({
                        err: err,
                        msg: "Error"
                    })
                })
            }
        }
    })
}
exports.updateDP = (req, res) => {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if ((!err) && files.dp) {
            Profile.findOneAndUpdate({ mobileNumber: req.params.mobileNumber }, {
                $set: {
                    DP: {
                        data: fs.readFileSync(files.dp.path)
                    },
                }
            }, (err, result) => {
                if (err)
                    return res.status(500).json({
                        msg: err
                    })
                return res.json({
                    msg: "Updated successfully",
                    data: result.DP.data
                })
            })
        }
        else {
            return res.json({
                err
            })
        }
    })
}
exports.updateCover = (req, res) => {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if ((!err) && files.cover) {
            Profile.findOneAndUpdate({ mobileNumber: req.params.mobileNumber }, {
                $set: {
                    DP: {
                        data: fs.readFileSync(files.cover.path)
                    },
                }
            }, (err, result) => {
                if (err)
                    return res.status(500).json({
                        msg: err
                    })
                return res.json({
                    msg: "Updated successfully",
                    result
                })
            })
        }
        else {
            return res.json({
                err
            })
        }


    })

}
exports.updateProfile = (req, res) => {

    Profile.findOneAndUpdate({ mobileNumber: req.params.mobileNumber }, {
        $set: req.body
    }, { new: true }, (err, result) => {
        if (err)
            return res.status(500).json({
                msg: err,

            })
        return res.json({
            msg: "Updated successfully",
            result
        })
    })
    



}
