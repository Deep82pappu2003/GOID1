const RideRequest = require("../models/Ride-request-model");
const Driver = require("../models/driver-model");
const Rider = require("../models/rider-model");
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const officeLocation = {
  latitude: 22.572790590435996,
  longitude: 88.43741479531052,
};

// Function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const createRideRequest = async (riderId, eId, pickupLocation, destination, carType, pickupAddress) => {
  try {
    const newRideRequest = await RideRequest.create({
      riderId,
      eId,
      pickupLocation: {
        type: "Point",
        coordinates: [pickupLocation.longitude, pickupLocation.latitude],
      },
      pickupAddress,
      destination: {
        type: "Point",
        coordinates: [officeLocation.longitude, officeLocation.latitude],
      },
      carType,
      status: 'pending', // Set status to pending
    });
    return newRideRequest;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const bookRide = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'You are not logged in' });
    }
    const { carType, eId, pickupAddress } = req.body;
    const riderId = req.session.user._id;
    const pickupLocation = req.session.homeLocation;

    const existingRideRequest = await RideRequest.findOne({
      riderId,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingRideRequest) {
      return res.status(400).json({ message: 'You can only book one ride at a time' });
    }

    // Find available drivers with the same car type
    const availableDrivers = await Driver.find({
      isAvailable: true,
      carType: carType // Match the requested car type
    });

    // If no drivers are available, respond with an alert
    if (availableDrivers.length === 0) {
      return res.status(400).json({ message: "No drivers available. Please try again later." });
    }

    // Create a new ride request with pending status
    const rideRequest = await createRideRequest(riderId, eId, pickupLocation, officeLocation, carType, pickupAddress);
    
    // Notify all available drivers about the new ride request (implement your notification logic)
    availableDrivers.forEach(driver => {
      console.log(`Notifying driver ${driver.dName} about a new ride request.`);
    });

    res.json({ message: "Ride request created successfully, awaiting driver acceptance.", rideRequest });

  } catch (err) {
    res.status(500).json({ message: "Error booking ride" });
  }
};

const getRideConfirmation = async (req, res) => {
  try {
      const rideRequestId = req.params.rideRequestId;
      const rideRequest = await RideRequest.findById(rideRequestId)
          .populate('driverId') // Populate driver details
          .populate('riderId'); // Populate rider details if you have a reference

      if (!rideRequest) {
          return res.status(404).json({ message: "Ride request not found" });
      }

      // Ensure rider information is correctly accessed
      const rider = {
          Name: req.session.user.eName || "Unknown Rider",
          contact: req.session.user.contact || "No contact info",
          eEmail: req.session.user.eEmail || "No email"
      };

      // Ensure driver information is correctly accessed
      const driver = rideRequest.driverId ? {
          name: rideRequest.driverId.dName || "Unknown Driver",
          contact: rideRequest.driverId.dcontact || "No contact info",
          dEmail: rideRequest.driverId.dEmail || "No email",
          latitude: rideRequest.driverId.latitude, // Pass the driver's latitude
      longitude: rideRequest.driverId.longitude, // Pass the driver's longitude
    
      } : null; // Handle case where driverId might not be populated

      res.render('rideConfirmation', { rider, driver, rideRequest,otp: rideRequest.otp }); // Pass OTP to the view
  } catch (error) {
      console.error("Error fetching ride details:", error); // Improved error logging
      res.status(500).json({ message: "Error fetching ride details" });
  }
};

const cancelRide = async (req, res) => {
  try {
      const { rideRequestId } = req.body; // Assume riderId is passed in the request body
      const rideRequest = await RideRequest.findOneAndUpdate(
          { _id: rideRequestId, status: "accepted" },
          { status: "cancelled" },
          { new: true }
      );

      if (!rideRequest) {
          return res.status(404).json({ message: "Ride request not found or already cancelled" });
      }

      // // Mark the driver as available again
      // await Driver.findByIdAndUpdate(rideRequest.driverId, { isAvailable: true });
// Mark the driver as available again if a driver was allocated
if (rideRequest.driverId) {
  await Driver.findByIdAndUpdate(rideRequest.driverId, { isAvailable: true });
}
      res.json({ success: true, message: "Your ride has been cancelled successfully." });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error cancelling ride" });
  }
};

const getRideOptions = async (req, res) => {
  try {
    const carTypes = ["Sedan", "SUV", "Hatchback"];
    res.json({ carTypes });
  } catch (err) {
    res.status(500).json({ message: "Error getting ride options" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'You are not logged in' });
    }

    const riderId = req.session.user._id; // Get the rider ID from the session
    const bookings = await RideRequest.find({ riderId }).populate('driverId'); // Fetch all bookings for the rider

    res.render('myBookings', { bookings }); // Render the myBookings view with the bookings data
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

module.exports = {
  bookRide,
  getRideConfirmation,
  cancelRide,
  getRideOptions,
  getMyBookings
};







// const RideRequest = require("../models/Ride-request-model");
// const Driver = require("../models/driver-model");
// const Rider = require("../models/rider-model");

// const nodemailer = require('nodemailer');
// const otpGenerator = require('otp-generator');
// const officeLocation = {
//   latitude: 22.572790590435996,
//   longitude: 88.43741479531052,
// };

// const sendOtp = async (email, otp) => {
//   const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true,
//       auth: {
//         user: 'goid.damid@gmail.com ',
//         pass: 'mevu fjne aiec aukb', 
//       },
//   });

//   const mailOptions = {
//       from: 'goid.damid@gmail.com ',
//       to: email,
//       subject: 'Your OTP for Ride Confirmation',
//       text: `Your OTP is: ${otp}`,
//   };

//   await transporter.sendMail(mailOptions);
// }

// // Function to calculate distance between two points using Haversine formula
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // Radius of the Earth in km
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a = 
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in km
// };


// const createRideRequest = async (riderId, eId, pickupLocation, destination, carType, pickupAddress,driverLocation) => {
//   try {
//     if (!pickupLocation || !driverLocation) {
//       throw new Error("Pickup location or driver location is undefined");
//     }
//     const newRideRequest = await RideRequest.create({
//       riderId,
//       eId,
//       pickupLocation: {
//         type: "Point",
//         coordinates: [pickupLocation.longitude, pickupLocation.latitude],
//       },
//       pickupAddress,
//       destination: {
//         type: "Point",
//         coordinates: [officeLocation.longitude, officeLocation.latitude],
//       },
//       carType,
//       driverLocation: {
//         type: "Point",
//         coordinates: [driverLocation.longitude, driverLocation.latitude],
//       },
//       status: 'pending',
//     });
//     return newRideRequest;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// const updateRideRequest = async (rideRequestId, driverId, status) => {
//   try {
//     const rideRequest = await RideRequest.findByIdAndUpdate(rideRequestId, {
//       driverId,
//       status,
//     }, { new: true });
//     return rideRequest;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
// const getRideOptions = async (req, res) => {
//   try {
//     const carTypes = ["Sedan", "SUV", "Hatchback"];
//     res.json({ carTypes });
//   } catch (err) {
//     res.status(500).json({ message: "Error getting ride options" });
//   }
// };

// const bookRide = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'You are not logged in' });
//     }
//     const { carType, eId, pickupAddress } = req.body;
//     const riderId = req.session.user._id;
//     const pickupLocation = req.session.homeLocation;

//     console.log('pickupLocation:', pickupLocation);

//     const existingRideRequest = await RideRequest.findOne({
//       riderId,
//       status: { $in: ["pending", "accepted"] },
//     });

//     if (existingRideRequest) {
//       return res.status(400).json({ message: 'You can only book one ride at a time' });
//     }

//     const destination = {
//       type: "Point",
//       coordinates: [officeLocation.longitude, officeLocation.latitude],
//     };
//     const availableDrivers = await Driver.find({
//       isAvailable: true,
//             carType: carType // Match the requested car type

//     });

    
//     if (availableDrivers.length > 0) {
      
//       let nearestDriver = null;
//       let shortestDistance = Infinity;

//       for (const driver of availableDrivers) {
//         const driverLocation = {
//           latitude: driver.latitude,
//           longitude: driver.longitude,
//         };
//         const distance = calculateDistance(
//           pickupLocation.latitude,
//           pickupLocation.longitude,
//           driverLocation.latitude,
//           driverLocation.longitude
//         );

//         if (distance < shortestDistance) {
//           shortestDistance = distance;
//           nearestDriver = driver;
//         }
//       }

//       if (nearestDriver) {
//         const driverLocation = {
//           latitude: nearestDriver.latitude,
//           longitude: nearestDriver.longitude,
//         };

//       const rideRequest = await createRideRequest(riderId, eId, pickupLocation, destination, carType, pickupAddress,driverLocation);
//       await Driver.findByIdAndUpdate(nearestDriver._id, { isAvailable: false }); // Mark driver as unavailable

//       const updatedRideRequest = await updateRideRequest(rideRequest._id, nearestDriver._id, 'accepted');
//       const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
//       await RideRequest.findByIdAndUpdate(rideRequest._id, { otp }); // Store OTP in the ride request

//       await sendOtp(req.session.user.eEmail, otp);

//       res.json({ updatedRideRequest, driverLocation, pickupLocation });

//     } else {
//       const updatedRideRequest = await updateRideRequest(rideRequest._id, null, 'rejected');
//       res.json({ message: "No drivers available. Please try again later." });

//     }
//   } else{
//     res.json({ message: "No drivers available. Please try again later." });
//   }
// }catch (err) {
//     res.status(500).json({ message: "Error booking ride" });
//   }
// };


// const getRideDetails = async (req, res) => {
//   try {
//       const rideRequestId = req.params.rideRequestId;
//       console.log("Fetching ride details for ID:", rideRequestId); // Log the ride request ID

//       const rideRequest = await RideRequest.findById(rideRequestId)
//           .populate('driverId') // Populate driver details
//           .populate('riderId'); // Populate rider details if you have a reference

//       if (!rideRequest) {
//           console.error("Ride request not found for ID:", rideRequestId); // Log if not found
//           return res.status(404).json({ message: "Ride request not found" });
//       }

//       // Ensure rider information is correctly accessed
//       const rider = {
//           Name: req.session.user.eName || "Unknown Rider",
//           contact: req.session.user.contact || "No contact info",
//           eEmail: req.session.user.eEmail || "No email"
//       };

//       // Ensure driver information is correctly accessed
//       const driver = rideRequest.driverId ? {
//           name: rideRequest.driverId.dName || "Unknown Driver",
//           contact: rideRequest.driverId.dcontact || "No contact info",
//           dEmail: rideRequest.driverId.dEmail || "No email"
//       } : null; // Handle case where driverId might not be populated

//       console.log("Ride request found:", rideRequest); // Log the ride request details
//       res.render('rideDetails', { rider, driver, otp: rideRequest.otp }); // Pass OTP to the view
//   } catch (error) {
//       console.error("Error fetching ride details:", error); // Improved error logging
//       res.status(500).json({ message: "Error fetching ride details" });
//   }
// };


// // const cancelRide = async (req, res) => {
// //   try {
// //       const { riderId } = req.body; // Assume riderId is passed in the request body
// //       const rideRequest = await RideRequest.findOneAndUpdate(
// //           { riderId, status: "accepted" },
// //           { status: "cancelled" },
// //           { new: true }
// //       );

// //       if (!rideRequest) {
// //           return res.status(404).json({ message: "Ride request not found or already cancelled" });
// //       }

// //       // Mark the driver as available again
// //       await Driver.findByIdAndUpdate(rideRequest.driverId, { isAvailable: true });

// //       res.json({ success: true, message: "Your ride has been cancelled successfully." });
// //   } catch (error) {
// //       console.error(error);
// //       res.status(500).json({ message: "Error cancelling ride" });
// //   }
// // };

// const cancelRide = async (req, res) => {
//   try {
//       const { rideRequestId } = req.body; // Assume riderId is passed in the request body
//       const rideRequest = await RideRequest.findOneAndUpdate(
//           { rideRequestId, status: "accepted" },
//           { status: "cancelled" },
//           { new: true }
//       );

//       if (!rideRequest) {
//           return res.status(404).json({ message: "Ride request not found or already cancelled" });
//       }

//       // Mark the driver as available again
//       await Driver.findByIdAndUpdate(rideRequest.driverId, { isAvailable: true });

//       res.json({ success: true, message: "Your ride has been cancelled successfully." });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error cancelling ride" });
//   }
// };


// const getMyBookings = async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'You are not logged in' });
//     }

//     const riderId = req.session.user._id; // Get the rider ID from the session
//     const bookings = await RideRequest.find({ riderId }).populate('driverId'); // Fetch all bookings for the rider

//     res.render('myBookings', { bookings }); // Render the myBookings view with the bookings data
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     res.status(500).json({ message: "Error fetching bookings" });
//   }
// };




// // const getPendingRideRequests = async (req, res) => {
// //   try {
// //     // Assuming the driver's ID is stored in the session
// //     const driverId = req.session.user._id; 
// //     const rideRequests = await RideRequest.find({ status: 'pending' }).populate('riderId');
    
// //     res.render('rideRequests', { rideRequests }); // Render the ride requests view
// //   } catch (error) {
// //     console.error("Error fetching ride requests:", error);
// //     res.status(500).json({ message: "Error fetching ride requests" });
// //   }
// // };

// // const acceptRideRequest = async (req, res) => {
// //   try {
// //     const rideRequestId = req.params.id;
// //     const updatedRequest = await RideRequest.findByIdAndUpdate(
// //       rideRequestId, 
// //       { status: 'accepted', driverId: req.session.user._id }, 
// //       { new: true }
// //     );
// //     await Driver.findByIdAndUpdate(req.session.user._id, { isAvailable: false }); // Mark driver as unavailable
// //     res.json({ message: "Ride request accepted", updatedRequest });
// //   } catch (error) {
// //     console.error("Error accepting ride request:", error);
// //     res.status(500).json({ message: "Error accepting ride request" });
// //   }
// // };

// // const cancelRideRequest = async (req, res) => {
// //   try {
// //     const rideRequestId = req.params.id;
// //     // Do not update the status in the database
// //     res.json({ message: "Ride request cancellation acknowledged" });
// //   } catch (error) {
// //     console.error("Error cancelling ride request:", error);
// //     res.status(500).json({ message: "Error cancelling ride request" });
// //   }
// // };

// module.exports = { createRideRequest, bookRide, getRideOptions, getRideDetails,cancelRide , getMyBookings};
// // module.exports = { createRideRequest, bookRide, getRideOptions, getRideDetails, cancelRide, getMyBookings, getPendingRideRequests, acceptRideRequest, cancelRideRequest };
