import mongoose from 'mongoose';
import {app} from './app.js'
import multer from 'multer'


const PORT=8000

main().then(() => console.log("connected to MongoDB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/dealsdraydb');
}

app.listen(PORT , () =>{
    console.log("server is running on port 8000");
});

