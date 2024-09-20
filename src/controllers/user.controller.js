import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const loginUser = async (req, res) => {
  const { f_userName, f_Pwd } = req.body;

  if (!f_userName && !f_Pwd) {
    return res.status(200).json({status:false, message:"Username and Password required fields"});
  }

  const user = await User.findOne({ f_userName: f_userName, f_Pwd : f_Pwd});
  if (!user) {
    return res.status(200).json({status:false, message:"Invalid username and password"});
  }
  const loggedInUser = await User.findById(user._id).select("-f_Pwd");

  return res.status(200).json({status:true, message:"User logged In Successfully", user:loggedInUser});

};


export { loginUser };
