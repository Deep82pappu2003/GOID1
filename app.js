const express = require('express');
const app =express();
const path= require('path');
const cookieParser =require("cookie-parser");
const expressSession=require("express-session");
const flash=require("connect-flash");
require("dotenv").config();
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
const db=require("./config/mongoose-connection");
const dv_=db.mongoose1;
const ridersRouter = require("./routes/ridersRouter");
const adminRouter = require("./routes/admin-router");
const driverRouter = require("./routes/driverRouter");
const rideOptRouter = require("./routes/rideOpt-router");

app.set('view engine','ejs');
app.use(flash());

app.use(
    expressSession({
        resave:false,
        saveUninitialized:false,
        secret:process.env.EXPRESS_SESSION_SECRET,
        cookie:{ maxAge:900000}
    })
);



app.use(express.static(path.join(__dirname,'public')));
const indexRouter = require("./routes/index");
app.use("/rider",ridersRouter);
app.use("/",indexRouter);
app.use("/admin",adminRouter); 
app.use("/driver",driverRouter); 
app.use("/rideOpt",rideOptRouter); 

app.get('/ride-details', (req, res) => {
    res.render('ride1');  // Render Ride1.ejs
});

app.get('/rider-details', (req, res) => {
    res.render('rider1');  // Render rider1.ejs
});

app.get('/driver-details', (req, res) => {
    res.render('driver1');  // Render driver1.ejs
});

app.get('/Registered-Riders', async (req, res) => {
    try {
      const riders = await db.display_Riders();  // Await the result of display_Riders
      const html = `
        <html>
            <head>
                <style>
                    .highlight {
                        font-weight: bold; /* or any other styling you prefer */
                        color: blue; /* for example, to change the text color */
                    }
                </style>
            </head>
            <body>
                <ol>
                    ${riders.map((user) => `
                        <li>
                            <span class="highlight">_id</span> : ${user._id}<br>
                            <span class="highlight">E_id</span> : ${user.eId}<br>
                            <span class="highlight">Full_Name</span> : ${user.eName}<br>
                            <span class="highlight">Email</span> : ${user.eEmail}<br>
                            <span class="highlight">Contact No.</span> : ${user.contact}<br>
                            <span class="highlight">Address</span> : ${user.eAddress}<br>
                            <span class="highlight">Latitude</span> : ${user.latitude}<br>
                            <span class="highlight">Longitude</span> : ${user.longitude}<br>
                            <span class="highlight">Password</span> : ${user.password}<br>
                            <span class="highlight">OTP</span> : ${user.otp}<br>
                            <span class="highlight">OTP_Expires</span> : ${user.otpExpires}<br>
                            <span class="highlight">__v</span> : ${user.__v}
                        </li>`).join("")}
                        <br><br>
                </ol>
            </body>
        </html>
    `;
    res.send(html);

    } catch (err) {
      res.status(500).send("Error fetching riders data.");
    }
});

app.get('/Registered_Drivers', async (req, res) => {
    try {
      const drivers = await db.display_Drivers();  
      const html = `
        <html>
            <head>
                <style>
                    .highlight {
                        font-weight: bold; /* or any other styling you prefer */
                        color: blue; /* for example, to change the text color */
                    }
                </style>
            </head>
            <body>
                <ol>
                    ${drivers.map((user) => `
                        <li>
                            <span class="highlight">_id</span> : ${user._id}<br>
                            <span class="highlight">Full_Name</span> : ${user.dName}<br>
                            <span class="highlight">Email</span> : ${user.dEmail}<br>
                            <span class="highlight">Contact No.</span> : ${user.dcontact}<br>
                            <span class="highlight">Govt_idCard_no.</span> : ${user.govtId}<br>
                            <span class="highlight">Driving_License_no.</span> : ${user.license}<br>
                            <span class="highlight">Address</span> : ${user.dAddress}<br>
                            <span class="highlight">Password</span> : ${user.password}<br>
                            <span class="highlight">OTP</span> : ${user.otp}<br>
                            <span class="highlight">__v</span> : ${user.__v}
                        </li>`).join("")}
                        <br><br>
                </ol>
            </body>
        </html>
    `;
    res.send(html);

    } catch (err) {
      res.status(500).send("Error fetching riders data.");
    }
});

app.get('/Pending-Rides-Requests', async (req, res) => {
    try {
      const rideRequests = await db.display_Ride_Request();  
      const html = `
        <html>
            <head>
                <style>
                    .highlight {
                        font-weight: bold; /* or any other styling you prefer */
                        color: blue; /* for example, to change the text color */
                    }
                </style>
            </head>
            <body>
                <ol>
                    ${rideRequests.map((user) => `
                        <li>
                            <span class="highlight">_id</span> : ${user._id}<br>
                            <span class="highlight">Rider_Id</span> : ${user.riderId}<br>
                            <span class="highlight">Pick_Up_Location</span> : ${user.pickupLocation}<br>
                            <span class="highlight">Pick_Up_Address</span> : ${user.pickupAddress}<br>
                            <span class="highlight">Destination</span> : ${user.destination}<br>
                            <span class="highlight">Car_Type</span> : ${user.carType}<br>
                            <span class="highlight">Status</span> : ${user.status}<br>
                            <span class="highlight">Time_Stamp</span> : ${user.timestamp}<br>
                            <span class="highlight">__v</span> : ${user.__v}
                        </li>`).join("")}
                        <br><br>
                </ol>
            </body>
        </html>
    `;
    res.send(html);

    } catch (err) {
      res.status(500).send("Error fetching riders data.");
    }
});

app.listen(3005,function(){
    console.log("running");
});