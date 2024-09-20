import mongoose from 'mongoose';
import { Employee } from "../models/employee.model.js"
import path from 'path'
import fs from 'fs'

const CreateEmployee= async (req, res) => {
    console.log(req.body)
    const { name, email, mobileNo, designation,gender,courses} = req.body; 
    
    let image = null;   
    if (req.files && req.files.image) {
        image = `${req.files.image[0].filename}`;  
    }

    if (!name || !email || !mobileNo || !designation || !gender ) {
        return res.status(400).json({ "status":false, message: "All field are mandatory" });
    }

    if (typeof name !== 'string') {
        return res.status(400).json({ "status":false, message: "Name must be a valid string" });
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ "status":false, message: "A valid email is required" });
    }

    const mobileNoPattern = /^\d{10}$/;
    if (!mobileNoPattern.test(mobileNo)) {
        return res.status(400).json({ "status":false, message: "A valid mobile number is required (10 digits)" });
    }

    if (typeof designation !== 'string' ) {
        return res.status(400).json({ "status":false, message: "Designation must be a valid string" });
    }
    if (!['HR', 'Manager', 'Sales'].includes(designation)) {
        return res.status(400).json({ "status":false, message: "Designation must be either HR, Manager, or Sales" });
    }

    if (!['Male', 'Female', 'Other'].includes(gender)) {
        return res.status(400).json({"status":false, message: "Gender must be either Male, Female, or Other" });
    }

    if (courses && Array.isArray(courses)) {
        if (courses.length === 0) {
            return res.status(400).json({"status":false, message: "At least one course required" });
        }
    }else{
        return res.status(400).json({"status":false, message: "Course should be required field" });
    }


    try {
        const isExist =await Employee.findOne({email:email});
        if(isExist){            
            return res.status(400).json({ "status":false, message: "Employee already exist" });
        }
        const employee = new Employee({ name, email, mobileNo, designation,gender,courses,image });
        const savedEmp = await employee.save();

        return res.status(200).json({ status:true, emp: savedEmp, message: "Employee saved In Successfully" });

    } catch (err) {
        console.log(err);        
        return res.status(200).json({ "status":false, message: "Failed to save employee" });
    }
};

const allEmployee = async (req, res) => {    
    try {
        const employees = await Employee.find();
        return res.status(200).json({ status:true, message: "Employee Fetched Successfully",  employees: employees, });

    } catch (err) {
        console.log(err);
        
        res.status(500).send("Error fetching employees");
    }
};

const editEmployee=async (req, res) => {
    if(!req.params.id || req.params.id === ""){
        return res.status(400).json({ "status":false, message: "Invalid employee Id" });
    }
    try {
        const employee = await Employee.findById(req.params.id);
        return res.status(200).json({"status":true, message: "Employee fetched successfully", "employee": employee });
    } catch (err) {
        console.log(err);        
        res.status(500).send("Error fetching employee");
    }
};

const updateEmployee = async (req, res) => {
    const emp_id  = req.params.id;
    const { name, email, mobileNo, designation,gender,courses} = req.body; 
    
    let image = null;   
    if (req.files && req.files.image) {
        image = `${req.files.image[0].filename}`;  
    }

    if (!name || !email || !mobileNo || !designation || !gender ) {
        return res.status(400).json({ "status":false, message: "All field are mandatory" });
    }

    if (typeof name !== 'string') {
        return res.status(400).json({ "status":false, message: "Name must be a valid string" });
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ "status":false, message: "A valid email is required" });
    }

    const mobileNoPattern = /^\d{10}$/; 
    if (!mobileNoPattern.test(mobileNo)) {
        return res.status(400).json({ "status":false, message: "A valid mobile number is required (10 digits)" });
    }

    if (typeof designation !== 'string' ) {
        return res.status(400).json({ "status":false, message: "Designation must be a valid string" });
    }
    if (!['HR', 'Manager', 'Sales'].includes(designation)) {
        return res.status(400).json({ "status":false, message: "Designation must be either HR, Manager, or Sales" });
    }

    if (!['Male', 'Female', 'Other'].includes(gender)) {
        return res.status(400).json({"status":false, message: "Gender must be either Male, Female, or Other" });
    }

    if (courses && Array.isArray(courses)) {
        if (courses.length === 0) {
            return res.status(400).json({"status":false, message: "At least one course required" });
        }
    }else{
        return res.status(400).json({"status":false, message: "Course should be required field" });
    }


    if (!mongoose.Types.ObjectId.isValid(emp_id)) {
        return res.status(400).json({"status":false, message: "Employee Id not Found"});
    }

    try {

        const existingEmployee = await Employee.findOne({ email, _id: { $ne: emp_id } });

        if (existingEmployee) {
            return res.status(400).json({"status":false, message: "Email already in use by another employee" });
        }

        let updateData= null;
        let image = null;   
        if (req.files && req.files.image) {
            image = req.files.image[0].filename;
            updateData = { name, email, mobileNo, designation, gender, courses, image };
        }else{
            updateData = { name, email, mobileNo, designation, gender, courses };
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(emp_id, updateData, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not updated, Please try again" });
        }
        return res.status(200).json({"status":true, message: "Employee Updated successfully", "data": updatedEmployee });
    } catch (err) {
        console.log(err);
        return res.status(500).json({"status":false, message: "Error updating employee", error: err.message });
    }
};

const deleteEmployee =async (req, res) => {
    
    try {
        const employeeId = req.params.id;
       
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({"status":false, message: "Invalid Employee ID passed" });
        }

        const employee = await Employee.findById(employeeId);
        
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        await Employee.findByIdAndDelete(employeeId);

        if (employee.image) {
            console.log(employee.image);
            
            const filePath = path.join(process.cwd(), 'public/uploads', employee.image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); 
                console.log('Image deleted:', filePath);
            }
        }



        res.status(200).json({ "status":true, message: "Employee and associated image deleted successfully" });

    } catch (err) {
        console.error('Error details:', err); 
        res.status(500).json({ message: "Error deleting employee", error: err.message });
    }
};


const changeEmployeeStatus = async (req, res) => {
    const emp_id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(emp_id)) {
        return res.status(400).json({ message: "Invalid Employee ID format" });
    }

    try {
        const employee = await Employee.findById(emp_id);
        if (!employee) {
            return res.status(404).json({ "status":false, message: "Employee not found" });
        }

        let newStatus = employee.status === 'active' ? 'deactive' : 'active';
        employee.status = newStatus;
        await employee.save();

        return res.status(200).json({ status:true, message: `Employee status changed to ${newStatus}`, data: employee });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating employee status", error: err.message });
    }
};


export  {CreateEmployee, editEmployee,updateEmployee, allEmployee, deleteEmployee, changeEmployeeStatus}
