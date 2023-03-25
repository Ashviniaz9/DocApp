const userModel =require('../models/userModels')
import Doctors from './../client/src/pages/admin/Doctors';
const jwt =require('jsonwebtoken')
const bcrypt =require('bcryptjs')
const doctorModel =require('../models/doctorModel')

//regiter call back
const registerController =  async(req,res ) => {
  try{
    const exisitingUser = await userModel.findOne({email:req.body.email})
    if(exisitingUser){
      return res.status(200).send({message:'User Already Exist',success:false})
    }
    const password = req.body.password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password =hashedPassword;
    const newUser =new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register successfully" , success:true});
  
  

}
  catch(error){
    console.log(error)
    res.status(500).send({success:false, message: `Register Controller ${error.message}`})
  }
  
  
};
//logic call back
const loginController = async (req,res) => {
  try{
const user =await userModel.findOne({email:req.body.email})
if(!user){
  return res.status(200).send({message:`user not found`, success:false})
}
const isMatch = await bcrypt.compare(req.body.password ,user.password)
if(!isMatch){
  return res.status(200).send({message:'Invalid Email or Password',success:false })
}
const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn: '1d'})
res.status(200).send({message:" login success", success: true,token});
  }
  catch(error){
    console.log(error)
    res.status(500).send({
      message:`Error in Logic CTRL ${error.message}`
    })
  }
};
const authController= async( req,res)=>{
  try{
const user= await userModel.findById({
  _id:req.body.userId
});
user.password=undefined;
if(!user){
  return res.status(200).send({
    message: 'user not found',
    success:false,
  })
}
else{
  res.status(200).send({
    success:true,
    data:user
  });
}




  }catch(error){
    console.log(error)
    res.status(500).send({
      message:'auth error',
      success:false,
      error
    })

  }

}

const applyDoctorController = async(req,res) => {
try{
const  newDoctor = await doctorModel({...req.body,status:'pending'})
await newDoctor.save()
const adminUser =await userModel.findOne({isAdmin:true})
const notification = adminUser.notification
notification.push({
  type:'apply-doctor-request',
  message: `${newDoctor.firstName} ${newDoctor.lastName} Has applied for a doctor account`,
  data:{
    doctorId: newDoctor._id,
    name : newDoctor.firstName + " " +newDoctor.lastName,
    onclickPath:'/admin/doctors'
  }
})
await userModel.findByIdAndUpdate(adminUser._id,{notification})
res.status(201).send({
  success:true,
  message:'Doctor Account Applied Successfully'  
})







}
catch(error){
  console.log(error)
  res.status(500).send({
    success:false,
    error,
    message:'Error While Applying For Doctor'
  })
}
}
//notifiaction ctrl
const getAllNotificationController= async(req,res)=>{
  try{
    const user =await userModel.findOne({_id:req.body.userId})
    const seennotification = user.seennotification
    const notifiaction =user.notification
    seennotification.push(...notification)
    user.notification=[]
    user.seennotification=notification
    const updatedUser =await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  }
  catch(error){
    console.log(error)
    res.status(500).send({
    message: 'Error in notification',
    success: false,
    error,
    }) 
  }

};
//delete notifications
const deleteAllNotificationController =async( req,res) => {
  try{
  const user =await userModel.findOne({ _id: req.body.userId});
  user.notification=[];
  user.seennotification =[];
  const updatedUser =await user.save();
  updatedUser.password=undefined;
  res.status(200).send({
    success: true,
    message: "Notification Deleted successfully",
    data: updatedUser,
  });
  }catch(error){
   console.log(error)
   res.status(500).send({
    success:false,
    message:'unable to delete all notifications',
    error
   })
  }
};

//get all doc
const getAllDoctorsController =async(req,res) =>
{try{
  const doctors = await doctorModel.find({status:'approved'})
  res.status(200).send({
    success:true,
    message:"Doctors lists fetched successfully",
    data: doctors,
  })

}catch(error){
console.log(error)
res.status(500).send({
  success:false,
  error,
  message:'Error while fetching doctor'
})
}
  
};
//book appointment
const bookAppointmentController = async(req,res) => {
try{
  req.body.status = 'pending'


}catch(error){
console.log(error)
res.status(500).send ({

})
}
};


module.exports = { loginController , registerController ,authController ,applyDoctorController,getAllNotificationController,
deleteAllNotificationController ,
getAllDoctorsController,
bookAppointmentController };

