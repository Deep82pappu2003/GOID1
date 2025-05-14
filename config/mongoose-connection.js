
const mongoose=require("mongoose");
const {seedAdminData}=require('../utils/seedAdmin');
const Rider = require('../models/rider-model');
const Driver = require('../models/driver-model');
const RideRequest = require('../models/Ride-request-model');

mongoose.connect("mongodb+srv://debojyotimondal355:dQP5aLM9t6WJfF0K@cluster0.nzv7k.mongodb.net/Goid")
.then(async ()=>{
    console.log("MongoDB connected");
    await seedAdminData();
})
.catch(function(err){
    console.log(err);
});

async function displayRiders() {
    try {
        registered_riders = await Rider.find({})
        return registered_riders;
    } catch (err) {
        console.error("Error fetching riders data: ", err);
    }
}

async function displayDrivers() {
    try {
        registered_drivers = await Driver.find({})
        return registered_drivers;
    } catch (err) {
        console.error("Error fetching riders data: ", err);
    }
}

async function displayRideRequest() {
    try {
        Ride_Request = await RideRequest.find({})
        return Ride_Request;
    } catch (err) {
        console.error("Error fetching riders data: ", err);
    }
}

module.exports={
    mongoose1:mongoose.connection,
    display_Riders:displayRiders,
    display_Drivers:displayDrivers,
    display_Ride_Request:displayRideRequest,
};



