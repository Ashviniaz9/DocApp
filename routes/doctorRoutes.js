const express =require('express');
const {getDoctorInfoController , updateProfileController , getDoctorByIdController} =require("../controllers/doctorCtrl")
const authMiddleware =require("../middlewares/authMiddleware");
//post single 
router.post("/getDoctorInfo" , authMiddleware ,getDoctorInfoController);

//post update profile
router.post('/updateProfile' , authMiddleware ,updateProfileController)
//post get single 
router.post('/getDoctorById',authMiddleware,getDoctorByIdController)

module.exports =router;