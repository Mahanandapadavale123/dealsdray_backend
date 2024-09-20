import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Login from './login.jsx';


const app = express();
app.use(bodyParser.json());

const LoginSchema = new mongoose.Schema({
  f_sno: Number,
  f_userName: String,
  f_Pwd: String,
});

const Login = mongoose.model('Login', LoginSchema);

app.post('/api/login', async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await Login.findOne({ f_userName: userName, f_Pwd: password });
    
    if (user) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
  