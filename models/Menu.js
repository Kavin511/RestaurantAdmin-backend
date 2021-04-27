var mongoose = require('mongoose')
var Schema = mongoose.Schema
var foodSchema = new Schema({
    imageUrl:String,
    foodName: String,
    foodDesc:String,
    category: String,
    price: String,
    foodType: String,
    availability: String,
    
});
var menuSchema = new Schema({
    mobileNumber: {
        type: String,
        required: true,
    },
    foodItems: [foodSchema]

}, {
    timestamps: true,
}
);
module.exports = mongoose.model('Menu', menuSchema)