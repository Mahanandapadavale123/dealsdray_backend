import express from "express"
import cookieParser from "cookie-parser"
import { Router } from "express";
import cors from 'cors';

const app = express()
const router = Router();
app.use(router);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true
}));


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/public', express.static('public'));
app.use(cookieParser())


app.get('/', (req, res)=>{
    res.send('Node Started With PORT 8000');
})

import userRouter from './routes/user.routes.js'
import employeeRouter from './routes/employee.router.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/employees", employeeRouter)


export { app }