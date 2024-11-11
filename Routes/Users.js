import express from 'express'
import User from '../Models/User.js';
import middleware from '../Middleware/middleware.js';
const datarouter=express.Router()


datarouter.get('/:isActive',middleware,async (req,res)=>{
    const {isActive} =req.params;
    const filter={}
    if(isActive == 1){
        filter.inactiveDateTime =null
    }
    else if(isActive == 0 ){
        filter.inactiveDateTime = {$ne :null}
    }
    if(req.user.role != 'Admin'){
        filter._id=req.user.id
    }
    const users=await User.find(filter).populate({
        path:'team',
        select:'name'
    })
    return res.status(200).json({success:true,users,message:"users data fetched successfully"})
})

datarouter.get('/activeUsers/:isActive',async (req,res)=>{
    const {isActive} =req.params;
    const filter={}
    if(isActive == 1){
        filter.inactiveDateTime =null
    }
    else if(isActive == 0 ){
        filter.inactiveDateTime = {$ne :null}
    }
    
    const users=await User.find(filter)
    return res.status(200).json({success:true,users,message:"users data fetched successfully"})
})

export default datarouter;