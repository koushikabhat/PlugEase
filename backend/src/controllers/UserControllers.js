// const User = require('../models/UserModel');

const registerUser = async(req, res)=>{
    try
    {
        //collecting the name email and some user information 
        const {name, email } = req.body;
        if(!name || !email)
        {
            console.log("Please provide all the details data insufficient at register user function");
            return res.status(400).json({message: "Please provide all the details", success : false});
        }

        //check if user already exists
    }
    catch(error)
    {
        console.log(" Error occurred at the register User Function at the userController");
        return res.status(500).json({message: "Internal Server Error", success : false});

    }
}

module.exports = {registerUser};