import express from 'express'
import mongoose from 'mongoose'
const teamModel=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    user:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    inactiveDateTime:{
        type:Date,default:null
    }
    
})

const Team = mongoose.model("Team",teamModel)
export default Team;