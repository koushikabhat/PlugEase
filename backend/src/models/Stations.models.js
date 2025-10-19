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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  opensAt: {
    type: Number, // minutes from midnight, e.g., 08:00 -> 480
    required: true,
    default: 480
  },
  closesAt: {
    type: Number, // minutes from midnight, e.g., 22:00 -> 1320
    required: true,
    default: 1320
  },
  bookedslots: {
    type: Number,
    default: 0,
    validate: {
      validator: function (value) {
        // "this" refers to the document being validated
        return value <= this.slots;
      },
      message: props => `Booked slots (${props.value}) cannot exceed total slots`
    }
  }
}, { timestamps: true });

// Add geospatial index
stationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Stations", stationSchema);
