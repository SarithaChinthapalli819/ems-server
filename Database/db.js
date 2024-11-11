import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()
const connectDB = async ()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/EMS')
        console.log('DB connected...')
    }
    catch(err){
        console.log(err)
    }
}
export default  connectDB;