var mongoose = require('mongoose')
var Schema = mongoose.Schema

var profileSchema = new Schema({
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type:String,        
    },
    hotelName: {
        type: String
    },
    address: {
        type: String,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
    },
    DP:
    {
        data: Buffer,
        contentType: String
    },
    cover: {
        data: Buffer,
        contentType: String
    }
}, {
    timestamps: true,
});
module.exports = mongoose.model('Profile', profileSchema)