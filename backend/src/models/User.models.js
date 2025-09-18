const mongoose = require('mongoose');   

const userSchema = new mongoose.Schema(
    {
    PhoneNumber : {
        type : String,
        required : true,
        unique : true
    },
    Name :{ //later 
        type : String,
        default : ""
    },
    Email : { //later 
        type : String,
        default : ""
    },

},{timestamps: true});

module.exports = mongoose.model("User",userSchema);