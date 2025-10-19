
const Bookings = require('../models/Booking.models');


const getBookingHistory = async(req,res)=>{
    console.log(" inside getbookingHistory");
    const userId = req.user._id;
    console.log("userid", userId);
    try
    {
        if(!userId){ return res.status(400).json({ message : "UserId missing"});}

        const bookingsData  = await Bookings.find({bookedBy :userId }).populate('stationId');

        console.log("Booked station by user ",bookingsData);
        
        if(bookingsData.length === 0){ return res.status(200).json({message : "No Bookings Found", success : false});}

        
        return res.status(200).json({message : "bookings found ", data: bookingsData, success:true});
    }
    catch(error)
    {
        console.log(" error occured at getBoookings controller",  error);
        return res.status(400).json({message : "Internal Server Error" ,success : false});
    }
}

module.exports = {getBookingHistory};