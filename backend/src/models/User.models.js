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
    role:
    {
        type : String,
        enum :["user", "service-provider"],
        default : "user"
    }

},{timestamps: true});

module.exports = mongoose.model("User",userSchema);