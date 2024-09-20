import { Router } from 'express'
import multer from "multer";

import {CreateEmployee, editEmployee, updateEmployee ,allEmployee, deleteEmployee, changeEmployeeStatus} from "../controllers/employee.controller.js"

const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads/")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true); 
    } else {
      cb(new Error('Only .png and .jpg image files are allowed!'), false); 
    }
  }
});


router.route('/').get(allEmployee);

router.route('/').post(upload.fields([{ name: 'image', maxCount: 1 }]) ,CreateEmployee);

router.route('/:id').get(editEmployee);

router.route('/:id').put(upload.fields([{ name: 'image', maxCount: 1 }]) ,updateEmployee);

router.route ('/:id').delete(deleteEmployee);

router.route ('/:id/change-status').post(changeEmployeeStatus);



export default router;
