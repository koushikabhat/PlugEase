const bcrypt = require('bcrypt');
const otpDb = require('../models/Otp.models')
const { generateTokens } = require("../utils/jwt.utils");
const User = require("../models/User.models");




const sendOtp  = async (req,res) =>{

    try{
        console.log("Inside the send otp function");    
        const {phone} = req.body;
        console.log(phone);

        if(!phone){
            return res.status(400).json({message: "phone Number required", success : false});
        }

        // generating random 6 digit number 
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const hashedOtp = await bcrypt.hash(otp, 10);

        await otpDb.findOneAndUpdate(
            {phone},
            {otp : hashedOtp, createdAt : new Date()},
            {upsert : true, new:true}
        );
        
        console.log(otp);

        return res.status(200).json({message : "Successfully sent the otp", success : true});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message : "Internal Server Error at the authController file" , success : false});
    }
    
}

const verifyOtp = async (req,res) =>{
    try{
        console.log(" req body is ", req.body);
        console.log("Inside the verify otp function");
        if(!req.body?.otp || !req.body?.phone)
        {
            console.log("Request body is missing at verify otp function");
            return res.status(400).json({message : "Request body is missing", success : false});
        }
        const{ phone, role} = req.body;
        const otp = req.body?.otp.toString();

        console.log(otp);
        if(!phone || !otp)
        {
            console.log("Phone or otp is missing at verify otp function");
            return res.status(400).json({message : "Phone or otp is missing", success : false});
        }

        
        const otprecord = await otpDb.findOne({phone});
        console.log(otprecord.otp);
        if (!otprecord.otp) 
        {
            return res.status(400).json({ message: "OTP expired or not found", success: false });
        }

        console.log("Comparing the otp");
        const isMatch = await bcrypt.compare(otp.toString(), otprecord.otp);

        if(!isMatch)
        {
            console.log("Invalid OTP at verify otp function");
            return res.status(400).json({ message: "Invalid OTP", success: false });
        }
        console.log("OTP verified successfully");

        // let user = await User.findOne({PhoneNumber : phone, role: role});
        let user = await User.findOne({PhoneNumber :phone });

        if(!user)
        {
            user = await User.create({PhoneNumber : phone, role : role});  
        }
        //generate a jwt token
        const token = generateTokens(user._id); //using  _.userId

        //deleting the otp from the store once verified
        console.log("token is", token);
        await otpDb.deleteOne({phone});

        console.log("response sent ")
        return res.status(200).json({message : "User verified successfully", success : true, token : token, user : user});
        
    }
    catch(error)
    {
        console.log(" Error Occurred at the verify Otp function at backend", error);
        return res.status(500).json({message : "Internal Sever Error at authentication ", success : false});
    }
};

module.exports = {sendOtp, verifyOtp};