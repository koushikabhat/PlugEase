
const Station = require('../models/Stations.models');
const Bookings = require('../models/Booking.models');
const { set } = require('mongoose');

const fetchStations = async(req,res)=>{
    const userId = req.user._id;
    console.log("userId is ",userId);
    
    try
    {
        const stations = await Station.find({createdBy: userId});
        if(!stations)
        {
            return res.status(200).json({message:"No stations found", success:true, stations:[]});
        }

        return res.status(200).json({message:"Stations fetched successfully", success:true, stations:stations});
    }
    catch(error)
    {
        console.log("Error occured at fetch stations",error)
        return res.status(400).json({message:"Internal Server Error", success:false});
    }


}

const fetchBookings = async(req,res)=>{
    const userId = req.user._id;
    // console.log("userId is ",userId);
    
    try
    {
        const stations = await Station.find({createdBy: userId});
        if(!stations)
        {
            return res.status(200).json({message:"No stations found", success:true, stations:[]});
        }

        const stationIds = stations.map(st => st._id);

        // console.log("stationIds are ",stationIds);


        const fetchBookings = await Bookings.find({stationId: {$in: stationIds}}).populate('stationId').populate('bookedBy');
        if(!fetchBookings)
        {
            return res.status(200).json({message:"No bookings found", success:true, bookings:[]});
        }
        console.log("fetchBookings is ",fetchBookings);
        return res.status(200).json({message:"Bookings fetched successfully", success:true, Bookings:fetchBookings});
    }
    catch(error)
    {
        console.log("Error occured at fetch stations",error)
        return res.status(400).json({message:"Internal Server Error", success:false});
    }
}


const ActivateStation = async (req, res) => {
  console.log("ActivateStation called with body:", req.body);
    const userId = req.user._id;
    const { stationId, isActive, openTime, closeTime } = req.body;
  
    try {
      if (!stationId)
      {
        return res.status(400).json({ message: "Station ID is required", success: false });
      }
  
      // Build dynamic update object
      const updateData = {};
      if (isActive !== undefined) updateData.status = isActive;
      if (openTime !== undefined) updateData.opensAt = openTime;
      if (closeTime !== undefined) updateData.closesAt = closeTime;
  
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update", success: false });
      }
  
      // Perform update in one query
      const updatedStation = await Station.findOneAndUpdate(
        { _id: stationId, createdBy: userId },
        { $set: updateData },
        { new: true, runValidators: true }
      );
  
      if (!updatedStation) {
        return res.status(404).json({ message: "Station not found or unauthorized", success: false });
      }
  
      return res.status(200).json({
        message: "Station updated successfully",
        success: true,
        station: updatedStation,
      });
    } catch (error) {
      console.error("Error occurred at ActivateStation:", error);
      return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

const fetchCurrentBookings = async(req,res)=>{
  const userId = req.user._id;

  try
  {
      const stations = await Station.find({createdBy : userId});
      if(!stations)
      {
          return res.status(200).json({message:"No stations found", success:true, stations:[]});
      }
      const stationIds = stations.map(st => st._id);

      const currentBookings = await Bookings.find({stationId: {$in: stationIds}, status: {$in: ['active']}}).populate('stationId').populate('bookedBy');

      if(!currentBookings)
      {
          return res.status(200).json({message:"No current bookings found", success:true, bookings:[]});
      }
      console.log("currentBookings is ",currentBookings);
      return res.status(200).json({message:"Current bookings fetched successfully", success:true, bookings:currentBookings});
  }
  catch(error)
  {
    console.log("Error occured at fetch current bookings",error)
    return res.status(400).json({message:"Internal Server Error", success:false});
  }
} 
  



module.exports = {fetchStations,fetchBookings,ActivateStation,fetchCurrentBookings};