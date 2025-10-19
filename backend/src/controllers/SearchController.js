// const express = require('express'); 
const env = require('dotenv');
const axios = require('axios');


env.config();

const Stations = require('../models/Stations.models'); 
const Bookings = require('../models/Booking.models')
const User = require('../models/User.models')

const AddStations = async(req,res)=>{ 
    const userId = req.user._id; 
    console.log(" Userid  from the auth middleware ", userId); 
    try
    {
        console.log("inside the AddStations controller ")
        if(!req.body)
        {
            return res.status(400).json({message : "Request Body is Null", success: false});
        }
        const{name, address, location, slots, supportedVehicles, status, opensAt, closesAt} = req.body;
        
        if(!name || !address || !location || !slots || !supportedVehicles || !status)
        {
            return res.status(400).json({message : "All fields are required ", success: false});
        }

        //save to db 
        //save only to db when there is no stations with same user 

        // const existingStation = await Stations.findOne({createdBy : userId});

        // if(existingStation)
        // {
        //     return res.status(200).json({message : "Station already exists for this user ", success: true, data: existingStation});
        // }

        const newStation = new Stations({
            name,
            address,
            location: {
                type: "Point",
                coordinates: [location.lng, location.lat] // Order: [longitude, latitude]
            },
            slots,
            supportedVehicles,
            status,
            opensAt,
            closesAt,
            createdBy : userId
        });

        await newStation.save();

        return res.status(200).json({message : "Station added successfully ", success: true, data: newStation});

    }
    catch(error)
    {
        console.log("Error occured at the Save Station ",error);
    }
}

const geocodePlace = async(place)=>{   

    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place)}&key=${process.env.GOOGLE_PLACE_API_KEY}`);

    if(response.data.status !== "OK")
    {
        throw new Error("Place not found");
    }
    const { lat, lng } = response.data.results[0].geometry.location;
    return {latitude : lat, longitude : lng };   
}

const SearchStations = async(req,res)=>{
    
    const{ place, supportedVehicles, slots, status }= req.body;
    if(!place)
    {
        return res.status(400).json({message : "Place Name Required ", success: false});
    }

    try
    {
        const location = await geocodePlace(place);


        const query = {
            location: 
            {
                $near: 
                {
                  $geometry: 
                  {
                    type: "Point",
                    coordinates: [location.longitude, location.latitude] // Order: [lng, lat]
                  },
                  $maxDistance: 5000 // 5 km
                }
            }
        };

        if(supportedVehicles) query.supportedVehicles = supportedVehicles;
        if(slots) query.slots = { $gt: 0 };
        if(status) query.status = status;

        console.log(" the query is ", query);



        const stations = await Stations.find(query);
        if(!stations.length)
        {
            console.log("No Stations Found ");
            return res.status(400).json({message : "No Stations Found ", success: false});
        }
        console.log("Stations Found ", stations);
        return res.status(200).json({message : "Stations Found ", success: true, data: stations});
    }
    catch(error)
    {
        console.log("Error occured at the Search Station ",error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

const SearchNearBy = async(req,res)=>{
    console.log("Inside the SearchNearby Controller ");
    try
    {
        const {latitude, longitude } = req.body;
        if(!latitude || !longitude)
        {
            return res.status(400).json({message : "Latitude and Longitude are required ", success: false});
        }
        
        const query = {
            location: 
            {
                $near: 
                {
                  $geometry: 
                  {
                    type: "Point",
                    coordinates: [longitude, latitude] // Order: [lng, lat]
                  },
                  $maxDistance: 5000 // 5 km
                }
            }
        };

        const stations = await Stations.find(query);
        if(!stations.length)
        {
            console.log("No Stations Found ");
            return res.status(400).json({message : "No Stations Found ", success: false});
        }
        console.log("Stations Found ", stations);
        return res.status(200).json({message : "Stations Found ", success: true, data: stations});
    }
    catch(error)
    {
        console.log("Error Occured at SearchNearby",error);
    }
}

// const convertTime = (userTime) =>{
//     const[h, m] = userTime.split(":").map(Number);
//     return h*60+m;
// }


const checkOverlay = (bookedFrom, bookedTo, userFrom, userTo) => {
    return userFrom < bookedTo && userTo > bookedFrom; // true if intervals overlap
  };
  
  const BookStation = async (req, res) => {

    console.log("inside bookstation ");
    const { stationId, timeFrom, timeTo } = req.body;
  
    try {
      const userId = req.user._id;

      if (!stationId || timeFrom == null || timeTo == null) {
        return res.status(400).json({ message: "Select the station and Time", success: false });
      }
  
      const station = await Stations.findById(stationId);
      if (!station) {
        return res.status(404).json({ message: "Station not found", success: false });
      }
  
      if (station.status !== "active") {
        return res.status(400).json({ message: "Select an active station", success: false });
      }
  
      // Check within opening hours
      if (!(timeFrom >= station.opensAt && timeTo <= station.closesAt)) {
        return res.status(400).json({
          message: "Book between opening and closing time of station",
          success: false,
        });
      }
  
      // Fetch all bookings for this station
      const booked = await Bookings.find({ stationId });
      
 
      
      let assignedSlot = null;


      for (let slotNum = 1; slotNum <= station.slots; slotNum++) 
      {
        const slotBookings = booked.filter((b) => parseInt(b.slot) === slotNum);
        if(slotBookings.length === 0 )
        {
            assignedSlot = slotNum;
            break;
        }
        const overlapping = slotBookings.some((b) => checkOverlay( b.time.fromTime, b.time.toTime, timeFrom, timeTo));
        if(!overlapping)
        {
            assignedSlot = slotNum;
            break;
        }
      }

    
  
      if(!assignedSlot) { 
        return res.status(400).json({
          message: "All slots are busy for this time range",
          success: false,
        });
      }
  
      // Save booking
      const booking = new Bookings({
        slot: String(assignedSlot),
        time: { fromTime: timeFrom, toTime: timeTo },
        stationId,
        bookedBy: userId,
      });

      

      await booking.save();
  
      return res.json({ message: "Booking created", success: true, booking });


    } catch (error) {
      console.log("Error in BookStation:", error);
      return res.status(500).json({ message: "Error at BookStation", success: false });
    }
  };
  

module.exports = { AddStations, SearchStations, SearchNearBy, BookStation};





