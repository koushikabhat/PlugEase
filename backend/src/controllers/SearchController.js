const express = require('express'); 
const env = require('dotenv');
const axios = require('axios');
env.config();

const Stations = require('../models/Stations.models'); 



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
        const{name, address, location, slots, supportedVehicles, status} = req.body;
        
        if(!name || !address || !location || !slots || !supportedVehicles || !status)
        {
            return res.status(400).json({message : "All fields are required ", success: false});
        }

        //save to db 
        //save only to db when there is no stations with same user 

        const existingStation = await Stations.findOne({createdBy : userId});

        if(existingStation)
        {
            return res.status(200).json({message : "Station already exists for this user ", success: true, data: existingStation});
        }

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
    return {latitude : lat, longitide : lng };   
}

const SearchStations = async(req,res)=>{
    
    const{ place }= req.body;
    if(!place)
    {
        return res.status(400).json({message : "Place Name Required ", success: false});
    }

    try
    {
        const location = await geocodePlace(place);

        const stations = await Stations.find({
            location: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [location.longitide, location.latitude] // Order: [lng, lat]
                },
                $maxDistance: 5000 // 5 km
              }
            }
        });
        if(!stations.length)
        {
            return res.status(400).json({message : "No Stations Found ", success: false});
        }
        return res.status(200).json({message : "Stations Found ", success: true, data: stations});
    }
    catch(error)
    {
        console.log("Error occured at the Search Station ",error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

const SearchNearBy = async(req,res)=>{
    try
    {

    }
    catch(error)
    {
        console.log("Error Occured at SearchNearby",error);
    }
}

module.exports = { AddStations, SearchStations};