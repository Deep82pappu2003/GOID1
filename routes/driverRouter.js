const express=require('express');
const router=express.Router();
const {registerDriver,sendOtp,verifyOtp,loginDriver,getPendingRideRequests,acceptRideRequest,cancelRideRequest}=require("../controllers/authController_driver");
router.get("/",function(req,res){
    res.send("Hey it is working!!");
});

// router.get('/logout',logoutUser);
router.post("/register",registerDriver);

router.post("/login",loginDriver);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Driver management of ride requests
router.get('/show-ride-requests', getPendingRideRequests); // New route to show ride requests
router.post('/accept-ride/:id', acceptRideRequest); // New route to accept a ride request
router.post('/cancel-ride/:id', cancelRideRequest); // New route to cancel a ride request

module.exports=router;