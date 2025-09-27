const mongoose =  require('mongoose')

const ProviderSchema = new mongoose.Schema(
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
        Role:
        {
            type : String,
            default : "service-provider"
        },
        createdBy:{
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User",
        }
    },{timestamps: true});

module.exports = mongoose.model("Provider",ProviderSchema);