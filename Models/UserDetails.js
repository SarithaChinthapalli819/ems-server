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
    isActive:{
        type:Boolean,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})

const UserDetails = mongoose.model("UserDetails",UserModel)
export default UserDetails;