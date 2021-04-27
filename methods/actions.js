var User = require('../models/user')
var Profile = require('../models/profile')
var image = require('../models/image')
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
var multer = require('multer')
var fs = require('fs')
const express = require("express")
const { profile } = require('console')
const router = express.Router()
const path = require('path')
var imgPath = 'D:/restaurant_backend/restaurant_backend/uploads/09d.png';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage });
var actions = {
    getDP: (req, res) => {
        profile.find({ mobileNumber: req.body.mobileNumber }, (err, item) => {
            if (err) {
                res.status(500).send(
                    err
                )
            }
            else {
                res.send(
                    { items: item }
                )
            }
        })

    },
    addImage: (upload.single("picture"), (req, res) => {
        console.log("Received file" + req.file.originalname);
        // var src=fs.createReadStream(req.file.path)
        // var dest=fs.createWriteStream('uploads/'+req.file.originalname);
        // src.pipe(dest)
        // src.on('end',()=>{
        //     fs.unlinkSync(req.file.path);
        //     res.json('OK:received'+req.file.originalname);
        // });
        // src.on('error',(err)=>{
        //     res.json('Something wrong'+err)
        // })
    }),
    getProfile:(req,res)=>{
        Profile.findOne({mobileNumber:req.params.mobileNumber},(err,result)=>{
            if(err)
            {
                res.status(404).send({
                    msg:"No profile"
                })
            }
            else
            {
                res.send(result)
            }
        })

    },
    update: (req, res) => {
        User.findOneAndUpdate({ mobileNumber: req.params.mobileNumber }, {
            $set: {
                password: req.body.password,
                email: req.body.email
            }
        }, (err, result) => {
            if (err)
                return res.status(500).json({
                    msg: err
                })
            return res.json({
                msg: "Updated successfully",
                mobileNumber: req.params.mobileNumber
            })
        })
    },
    getUser: (req, res) => {
        User.findOne({
            mobileNumber: req.params.mobileNumber
        },
            (err, user) => {
                if (err) {
                    throw err
                }
                else {
                    res.json({
                        user
                    })
                }
            })
    },
    addNew: (req, res) => {
        const user = User(
            {
                mobileNumber: req.body.mobileNumber,
                email: req.body.email,
                password: req.body.password,
            }
        );
        user.save().then(() => {
            console.log("user registered" + user);
            req.status(200).json(msg,);

        }).catch((err) => {
            res.status(403).json({
                msg: err
            });
        });
    },
    authenticate: (req, res) => {
        User.findOne({
            mobileNumber: req.body.mobileNumber
        }, (err, user) => {
            if (err) {
                throw err
            }
            if (!user) {
                res.status(403).send({
                    success: false,
                    msg: 'Failed to authenticate,User not found' + req.body.mobileNumber
                })
            }
            else {
                console.log(user.password + " " + req.body.password);

                if (user.password === req.body.password) {
                    var token = jwt.encode(user, config.secret)
                    res.json({
                        success: true,
                        msg: token
                    })
                }
                else {
                    res.status(403).send({
                        success: false,
                        msg: 'Failed to auth'
                    })
                }
                // user.comparePassword(req.body.password, (err, isMatch) => {
                //     if (isMatch && !err) {
                //         var token = jwt.encode(user, config.secret)
                //         res.json({
                //             success: true,
                //             msg: token
                //         })
                //     }
                //     else {
                //         res.status(403).send({
                //             success: false,
                //             msg: 'Failed to authenticate, wrong password'
                //         })
                //     }
                // })
            }
        })
    },
    getinfo: (req, res) => {
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
    addProfile: (req, res) => {
        // if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        //     var token = req.headers.authorization.split(' ')[1]
        //     var decodedtoken = jwt.decode(token, config.secret)
        const profile = Profile({
            mobileNumber: req.body.mobileNumber,
            // hotelName: req.body.hotelName,
            address: req.body.address,
            // location:
            // {
            //     coordinates: [
            //         req.body.latitude,
            //         req.body.longitude
            //     ]
            // }
        })
        profile.save().then(() => {
            return res.json({
                msg: "Saved successfully!"
            })
        }).catch((err) => {
            return res.status(400).json({
                err: err
            })
        })
        // }
    },
    addDP: (upload.single('image'), (req, res, next) => {
        Profile.findOneAndUpdate({ mobileNumber: req.body.mobileNumber }, {
            $set: {
                DP: {
                    data: fs.readFileSync(imgPath)
                },
            }
        },(err, result) => {
            if (err)
                return res.status(500).json({
                    msg: err
                })
               else
               {
                   fs.unlink(imgPath)
               }             
                    
                
            return res.json({
                msg: "Updated successfully",
                data:result.DP.data
            })
        }   )
        // const profile=Profile({
        //     DP: {
        //         data: fs.readFileSync(imgPath),
        //         contentType: 'image/png'
        //     }
        // })
        // profile.save().then(() => {
        //     return res.json({
        //         msg: "Saved successfully!"
        //     })
        // }).catch((err) => {
        //     return res.status(400).json({
        //         err: err
        //     })
        // })
    })
}
module.exports = actions