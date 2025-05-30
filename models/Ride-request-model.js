const mongoose = require("mongoose");

const rideRequestSchema = new mongoose.Schema({
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rider",
    
  },
  pickupLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  pickupAddress: {
    type: String,
    required: true,
  },
  destination: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  carType: {
    type: String,
    required: true,
  },
  
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed","cancelled"],
    default: "pending",
  },
  otp: { type: String }, // New field for OTP

  timestamp: {
    type: Date,
    default: Date.now,
  },
  driverId: { // New field to store the driver's ID
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
  },

  
});

const RideRequest = mongoose.model("RideRequest", rideRequestSchema);

module.exports = RideRequest;