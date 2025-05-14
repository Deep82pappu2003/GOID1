const driverModel = require("../models/driver-model");
const bcrypt = require("bcrypt");
const generateToken = require('../utils/generateToken');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

const RideRequest = require("../models/Ride-request-model");



// Send OTP
module.exports.sendOtp = async function(req, res) {
  let { dEmail } = req.body;
  if (!dEmail) {
    return res.status(400).json({ message: "Email is required" });
  }
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

  try {
  
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
        user: 'goid.damid@gmail.com',
        pass: 'mevu fjne aiec aukb',
      },
    });
    const mailOptions = {
      from: 'goid.damid@gmail.com',
      to: dEmail,
      subject: 'Verify your email',
      text:`Your OTP is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Sending OTP to email: ${dEmail}`);

    req.session.otp = otp;
    req.session.otpExpires = new Date(Date.now() + 300000); 

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
};


// Verify OTP
module.exports.verifyOtp = async function(req, res) {
  const { dEmail, otp } = req.body;
  if (!dEmail || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }
  try {
    if (req.session.otp === otp) {
      req.session.isOtpValid = true;
      res.json({ success: true, message: 'OTP is valid' });
    } else {
      res.json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
};

module.exports.registerDriver = async function(req, res) {
    
  try {
      let { dName,dEmail,dcontact,govtId,license, dAddress, latitude,longitude, password ,carType}= req.body;
  
      if (!dName ||!dEmail ||!govtId|| !license || !dcontact || !dAddress || !latitude || !longitude || !password ||!carType) {
        return res.status(400).json({ message: "Please provide all required fields" });
      }
  
      dEmail = dEmail.toLowerCase();
      console.log(`Checking for existing rider with email: ${dEmail}`);
  
      let existingDriver_License = await driverModel.findOne({ license });
      let existingDriver_GovtId = await driverModel.findOne({ govtId });
      let existingDriver_Email = await driverModel.findOne({ dEmail });
      let existingDriver_Contact = await driverModel.findOne({ dcontact });
  
      let errorMessage = [];

      if (existingDriver_License) errorMessage.push("Driver License");
      if (existingDriver_GovtId) errorMessage.push("Govt Id");
      if (existingDriver_Email) errorMessage.push("Email");
      if (existingDriver_Contact) errorMessage.push("Phone Number");

      if (errorMessage.length > 0) {
        const message = `${errorMessage.join(" and ")} already in use. Please choose different values.`;
        return res.status(401).json({ message });
      }
  
      if (!req.session.isOtpValid) {
        return res.status(401).json({ message: "Invalid OTP" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      
      let newDriver = await driverModel.create({
        dName,
        dEmail,
        govtId,
        license,
        dcontact,
        dAddress,
        latitude,
        longitude,
        carType,
        password: hashedPassword,
        otp: req.session.otp,
        otpExpires: req.session.otpExpires
      });
  
      let token = generateToken(newDriver);
      res.cookie("token", token, { httpOnly: true ,maxAge:120000});
      req.session.driverLoggedIn = true;
      req.session.user = newDriver;
      req.session.driverLocation={ latitude, longitude };
      res.status(201).json({ message: "Driver created successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };



  module.exports.loginDriver = async function(req, res) {
    try {
        let { dEmail, password } = req.body;
        
        if (!dEmail || !password) {
            return res.status(400).json({ message: "Please provide Driver Email and password" });
        }
        let driver = await driverModel.findOne({ dEmail });
        if (!driver) {
            return res.status(401).json({message: "Driver Email or password incorrect"});
        }

        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(401).json({message:"Driver Email or password incorrect"});
        }

        let token = generateToken(driver);
        res.cookie("token", token,{httpOnly:true,maxAge:120000});
        req.session.driverLoggedIn = true; 
        req.session.user=driver;
        req.session.driverLocation={ latitude: driver.latitude, longitude: driver.longitude };
        res.status(200).json({message:"Login successful"});
        
    } catch (err) {
        console.error("Error during registration:", err);  
        res.status(500).json({message:"Internal Server Error: " + err.message});
        }
};


// Get Pending Ride Requests
module.exports.getPendingRideRequests = async function(req, res) {
  try {
      const driverId = req.session.user._id; 
      const driver = await driverModel.findById(driverId); // Get the driver's details
// Find the accepted ride request for this driver
const acceptedRequest = await RideRequest.findOne({ 
  driverId: driverId, 
  status: 'accepted' 
}).populate('riderId');

      // const rideRequests = await RideRequest.find({ status: 'pending' }).populate('riderId');
      // Find ride requests that are pending and match the driver's car type
    //   const rideRequests = await RideRequest.find({ 
    //     status: 'pending', 
    //     carType: driver.carType 
    // }).populate('riderId');
// If no accepted request, find pending requests that match the driver's car type
const rideRequests = acceptedRequest ? [acceptedRequest] : await RideRequest.find({ 
  status: 'pending', 
  carType: driver.carType,
  driverId: { $ne: driverId } // Exclude requests already accepted by this driver
}).populate('riderId');

      res.render('rideRequests', { rideRequests }); // Render the ride requests view
  } catch (error) {
      console.error("Error fetching ride requests:", error);
      res.status(500).json({ message: "Error fetching ride requests" });
  }
};

// Accept Ride Request
module.exports.acceptRideRequest = async function(req, res) {
  try {
      const rideRequestId = req.params.id;
      const existingRequest = await RideRequest.findById(rideRequestId);

      // Check if the ride request is already accepted
      if (existingRequest.status === 'accepted') {
        return res.status(400).json({ message: "This ride request has already been accepted." });
    }

      const updatedRequest = await RideRequest.findByIdAndUpdate(
          rideRequestId, 
          { status: 'accepted', driverId: req.session.user._id }, 
          { new: true }
      );
      await driverModel.findByIdAndUpdate(req.session.user._id, { isAvailable: false }); // Mark driver as unavailable
      res.json({ message: "Ride request accepted", updatedRequest });
  } catch (error) {
      console.error("Error accepting ride request:", error);
      res.status(500).json({ message: "Error accepting ride request" });
  }
};

// Cancel Ride Request
module.exports.cancelRideRequest = async function(req, res) {
  try {
      const rideRequestId = req.params.id;
      const rideRequest = await RideRequest.findById(rideRequestId);
      if (!rideRequest) {
          return res.status(404).json({ message: "Ride request not found" });
      }
      // Mark the driver as available again
      await driverModel.findByIdAndUpdate(rideRequest.driverId, { isAvailable: true });
      res.json({ message: "Ride request cancellation acknowledged" });
  } catch (error) {
      console.error("Error cancelling ride request:", error);
      res.status(500).json({ message: "Error cancelling ride request" });
  }
};
