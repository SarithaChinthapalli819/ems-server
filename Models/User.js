import express from 'express'
import mongoose from 'mongoose'
const UserModel=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,enum:["Admin","Employee"],required:true
    },
    team:{
        type:mongoose.Schema.Types.ObjectId,ref:'Team'
    },
    Project:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Board'
    }],
    inactiveDateTime:{
        type:Date,default:null
    }
})

const User = mongoose.model("User",UserModel)
export default User;