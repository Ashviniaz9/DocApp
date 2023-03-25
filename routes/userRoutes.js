const express =require('express');



const { loginController, registerController, authController,
applyDoctorController,
getAllNotificationController,
deleteAllNotificationController

} = require('../controllers/userCtrl')


const authMiddleware =require("../middlewares/authMiddleware")



//router in ject
const router =express.Router()

//routes
//login||post

router.post('/login' ,loginController);

//register
router.post('/Register' ,registerController);


//auth
router.post('/getUserData',authMiddleware , authController)


//aapply doctor
router.post('/apply-doctor',authMiddleware , applyDoctorController)



//notifiaction doctor
router.post('/get-all-notification',authMiddleware , getAllNotificationController);

//notifiaction doctor
router.post('/delete-all-notification',authMiddleware , deleteAllNotificationController);
//get all doc
router.get('/getAllDoctors',authMiddleware ,getAllDoctorsController)

//book appointment
router.post('/book-appointment',authMiddleware , bookAppointmentController)



module.exports =router;
