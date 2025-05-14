
// // const express = require('express');
// // const router = express.Router();
// // const { getRideOptions, bookRide } = require("../controllers/rideReqController");
// // const authController = require("../controllers/authController");

// // router.get("/", function(req, res) {
// //     res.send("Hey it is working!");
// // });

// // router.get('/ride-options', getRideOptions);

// // router.post("/search-ride", bookRide);
// // router.get('/get-rider-data', authController.getRiderData);
// // router.get('/get-home-location', authController.getHomeLocation);

// // module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { getRideOptions, bookRide, getRideDetails, cancelRide } = require("../controllers/rideReqController");
// const authController = require("../controllers/authController");

// router.get("/", function(req, res) {
//     res.send("Hey it is working!");
// });

// router.get('/ride-options', getRideOptions);

// router.post('/search-ride', bookRide);
// router.get('/get-rider-data', authController.getRiderData);
// router.get('/get-home-location', authController.getHomeLocation);
// //router.get('/ride-details/:rideRequestId', getRideDetails); // New route for ride details
// router.get('/view-confirmation/:rideRequestId', getRideDetails);
// router.post('/cancel-ride',cancelRide);
// module.exports = router;

// // const express = require('express');
// // const router = express.Router();
// // const { getRideOptions, bookRide } = require("../controllers/rideReqController");

// // router.get("/", function(req, res) {
// //     res.send("Hey it is working!!");
// // });

// // router.get('/ride-options', getRideOptions);

// // router.post("/book-ride", bookRide);

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { getRideOptions, bookRide, getRideDetails, cancelRide } = require("../controllers/rideReqController");
// const authController = require("../controllers/authController");

// router.get("/", function(req, res) {
//     res.send("Hey it is working!");
// });

// router.get('/ride-options', getRideOptions);

// router.post("/search-ride", bookRide);
// router.get('/get-rider-data', authController.getRiderData);
// router.get('/get-home-location', authController.getHomeLocation);
// router.post('/cancel-ride',cancelRide);
// router.get('/view-confirmation/:rideRequestId', getRideDetails);
// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { getRideOptions, bookRide } = require("../controllers/rideReqController");
// const authController = require("../controllers/authController");

// router.get("/", function(req, res) {
//     res.send("Hey it is working!");
// });

// router.get('/ride-options', getRideOptions);

// router.post("/search-ride", bookRide);
// router.get('/get-rider-data', authController.getRiderData);
// router.get('/get-home-location', authController.getHomeLocation);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { getRideOptions, bookRide, getRideConfirmation, cancelRide, getMyBookings } = require("../controllers/rideReqController");
const authController = require("../controllers/authController");

router.get("/", function(req, res) {
    res.send("Hey it is working!");
});

router.get('/ride-options', getRideOptions);

router.post('/search-ride', bookRide);
router.get('/get-rider-data', authController.getRiderData);
router.get('/get-home-location', authController.getHomeLocation);
//router.get('/ride-details/:rideRequestId', getRideDetails); // New route for ride details
router.get('/ride-confirmation/:rideRequestId', getRideConfirmation);
router.post('/cancel-ride',cancelRide);
router.get('/my-bookings', getMyBookings); // New route for my bookings

// router.get('/driver/show-ride-requests', getPendingRideRequests); // New route to show ride requests
// router.post('/driver/accept-ride/:id', acceptRideRequest); // New route to accept a ride request
// router.post('/driver/cancel-ride/:id', cancelRideRequest); // New route to cancel a ride request

module.exports = router;