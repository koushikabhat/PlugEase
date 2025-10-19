const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    slot:{
        type : String,
        required: true
    },
    time : {
        fromTime :{type : Number},
        toTime:{type: Number},
        // required : true
    },
    stationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Stations',
        required : true
    },
    bookedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active',
        index: true // helps query performance
    }
},{timestamps : true});

module.exports = mongoose.model("Bookings", bookingSchema);