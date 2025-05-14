const express=require('express');
const router=express.Router();
const {loginAdmin}=require("../controllers/authController");
router.post("/login",loginAdmin);

router.get("/panel",function(req,res){
    res.send("Hey");
});

module.exports=router;