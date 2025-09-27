const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  slots: {
    type: Number,
    default: 0
  },
  supportedVehicles: {
    type: [String],
    enum: ['scooter', 'car'],
    default: ['scooter', 'car']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdBy:{
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref : "User",
  }
}, { timestamps: true });

// Add geospatial index for location
stationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Stations", stationSchema);
