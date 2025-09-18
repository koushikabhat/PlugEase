//mongodb connection
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDb = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected Successfully");
    }
    catch(err){
        console.error("Database Connection Failed from dbconfig.js", err);
        process.exit(1);
    }
}

module.exports = connectDb;
