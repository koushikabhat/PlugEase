const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const generateTokens = (userId)=>{
    return  accessToken = jwt.sign(
        {id : userId},
        process.env.JWT_SECRET,
        {expiresIn : process.env.JWT_EXPIRE}
    );
};
 

module.exports = {generateTokens};