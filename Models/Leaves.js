import express from 'express'
import mongoose from 'mongoose'
const LeavesModel=new mongoose.Schema({
    LeaveFrom:{
        type:Date,
        required:true
    },
    LeaveTo:{
        type:String,
        required:true
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,ref:'User'
    },
    isCanceled:{
        type:Boolean,
       default:false
    },
    inactiveDateTime:{
        type:Date,default:null
    },
    isApproved:{
        type:Boolean,
        default:false
    },
    isRejected:{
        type:Boolean,
        default:false
    },
    isPending:{
        type:Boolean,
        default:true
    }
})

const Leaves = mongoose.model("Leaves",LeavesModel)
export default Leaves;