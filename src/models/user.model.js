import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  f_sno: Number,
  f_userName: String,
  f_Pwd: String
});

export const User = mongoose.model("User", userSchema);
