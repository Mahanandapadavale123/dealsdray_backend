const mongoose  = require("mongoose");
const express= require("express");
const app = express();
const bodyParser = require('body-parser');

app.get("/",(req, res) =>{
    res.send("Hello World");
});



app.post('/login', async (req, res) => {
  const { f_sno, f_userName, f_Pwd } = req.body;
  try {
    const newLogin = new Login({ f_sno, f_userName, f_Pwd });
    await newLogin.save();
    res.status(201).json(newLogin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/logins', async (req, res) => {
  try {
    const logins = await Login.find();
    res.json(logins);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



app.listen(8080,() =>{
    console.log("server is running on port 8080");
});