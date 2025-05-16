const mongoose = require('mongoose') ;
const travelSchema = new  mongoose.Schema({
    weather: String,
    name : String,
    type: String,


})
module.exports= mongoose.model('Travel',travelSchema) 