//this is middleware to protect routes that require authentication

const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User.models');

//here token will come 
// compare the token if it is correct that only move ahead 
// else send error response


const protect = async(req, res, next) => {

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    {
        try
        {
            token = req.headers.authorization.split(" ")[1];

            //decoding the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if(!decoded)
            {
                return res.status(401).json({message : "Not authorized, token failed", success : false});
            }
            req.user = await User.findById(decoded.id).select("-__v"); //select everything except version of mongo in database 
            console.log("req user in token is ",req.user);

            if(!req.user)
            {
                return res.status(401).json({message : "User not found", success : false});
            }
            else{
                next(); //move to the next function
            }
        }
        catch(error)
        {
            console.log("Error occurred at the authMiddleware", error);
            return res.status(500).json({message : "Internal Server Error at authMiddleware", success : false});
        }
    }

    if(!token)
    {
        return res.status(401).json({message : "Not authorized, no token", success : false});
    }
};

module.exports = protect;
