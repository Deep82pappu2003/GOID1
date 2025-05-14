// // const mongoose=require("mongoose");

// // const driverSchema=mongoose.Schema({
// //     dName:{
// //         type:String,
// //         required:true
// //     },
    
// //     dcontact:{
// //         type:Number,
// //         required:true
// //     },
// //     govtId:{
// //         type:String,
// //         required:true
// //     },
// //     license:{
// //         type:String,
// //         required:true
// //     },

// //     dAddress:{
// //         type:String,
// //         required:true
// //     },
// //     dEmail:{
// //         type:String,
// //         required:true,
// //         unique:true
// //     },
// //     isAvailable: {
// //         type: Boolean,
// //         default: true
// //       },
    
    
// //     password:String,
// //     picture:String,
// //     otp:String,
// //     timestamp:Number
// // });

// // const Driver=mongoose.model("driver",driverSchema);

// // module.exports=Driver;


// const mongoose=require("mongoose");

// const driverSchema=mongoose.Schema({
//     dName:{
//         type:String,
//         required:true
//     },
//     dcontact:{
//         type:Number,
//         required:true
//     },
//     govtId:{
//         type:String,
//         required:true
//     },
//     license:{
//         type:String,
//         required:true
//     },
//     cartype:String,

//     dAddress:{
//         type:String,
//         required:true
//     },
//     dEmail:{
//         type:String,
//         required:true,
//         unique:true
//     },
    
//     isAvailable:{
//         type:Boolean,
//         default:true
//     },
    
//     password:String,
//     picture:String,
//     otp:String,
//     timestamp:Number
// });

// const Driver=mongoose.model("driver",driverSchema);

// module.exports=Driver;

const mongoose=require("mongoose");

const driverSchema=mongoose.Schema({
    dName:{
        type:String,
        required:true
    },
    
    dcontact:{
        type:Number,
        required:true
    },
    govtId:{
        type:String,
        required:true
    },
    license:{
        type:String,
        required:true
    },

    dAddress:{
        type:String,
        required:true
    },
    dEmail:{
        type:String,
        required:true,
        unique:true
    },
    isAvailable: {
        type: Boolean,
        default: true
      },
      carType: { // New field for car type
        type: String,
        required: true // Make it required if necessary
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    password:String,
    picture:String,
    otp:String,
    timestamp:Number,
    
});

const Driver=mongoose.model("Driver",driverSchema);

module.exports=Driver;