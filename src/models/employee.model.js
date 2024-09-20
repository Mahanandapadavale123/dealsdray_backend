import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema({
  image: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  mobileNo: Number,
  designation: String,
  gender: String,
  courses: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: 'At least one course is required'
    },
  },
  status:{type:String, default:"active"}
},
{
  timestamps:true
}
);

export const Employee = mongoose.model("Employee", employeeSchema);
