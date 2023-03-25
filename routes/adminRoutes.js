const express =require('express');
const { getAllUsersController,
getAllDoctorsController , changeAccountStatusController } = require('../controllers/adminCtrl');
const authMiddleware =require("../middlewares/authMiddleware");



const router =express.Router()

//get method || users

router.get('/getAllUsers', authMiddleware,getAllUsersController )

//get method || doctors
router.get('/getAllDoctors' , authMiddleware , getAllDoctorsController)

//post

router.post('/changeAccountStatus' , authMiddleware, changeAccountStatusController)



module.exports =router