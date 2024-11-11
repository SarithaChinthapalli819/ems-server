import express from 'express'
import Board from '../Models/Board.js';
import User from '../Models/User.js';

const boardRouter = express.Router()
boardRouter.post('/addProjects',async (req,res)=>{
    const {projectName} =req.body
    const sameExists = await Board.find({
        projectName: { $regex: new RegExp('^' + projectName + '$', 'i') },//checks from start to end if any match irrespective of case sensitive
        inActiveDateTime: null
    });    
    if(sameExists.length>0) return res.status(401).json({success:false,message:'Project Existed With Same Name..'})
    const project = new Board({
        projectName:projectName
    })
    await project.save()
    return res.status(200).json({success:true,message:'Project Added Succesfully ..'})
})

boardRouter.get('/',async (req,res)=>{
    const projects = await Board.find({inActiveDateTime:null})
    return res.status(200).json({success:true,projects,message:'Project Added Succesfully ..'})
})

boardRouter.put('/updateProject/:id',async (req,res)=>{
    const {id}=req.params
    const {projectName}=req.body
    const sameExists = await Board.find({
        projectName: { $regex: new RegExp('^' + projectName + '$', 'i') },
        inActiveDateTime: null,
        _id:{$ne:id}
    });    
    if(sameExists.length>0) return res.status(401).json({success:false,message:'Project Existed With Same Name..'})

    const projects = await Board.findByIdAndUpdate({_id:id},{projectName:projectName})
    return res.status(200).json({success:true,projects,message:'Project Updated Succesfully ..'})
})

boardRouter.delete('/deleteProject/:id',async (req,res)=>{
    const {id}=req.params
    const projects = await Board.findByIdAndDelete({_id:id})
    return res.status(200).json({success:true,projects,message:'Project Deleted Succesfully ..'})
})

boardRouter.post('/addMember/:id',async (req,res)=>{
    const {member} =req.body 
    const {id}=req.params
    await Board.findByIdAndUpdate({_id:id},{$push:{User:member}})
    await User.findByIdAndUpdate({_id:member},{$push:{Project:id}})
    return res.status(200).json({success:true,message:'Project Added Succesfully ..'})
})

boardRouter.get('/getMember/:id',async (req,res)=>{
    const {id}=req.params
    const members = await Board.find({_id:id}).populate({
      path:'User',
      select:'name email'  
    })
    return res.status(200).json({success:true,members,message:'Project Added Succesfully ..'})
})

boardRouter.put('/removeMember/:id',async (req,res)=>{
    const {id}=req.params
    const {member} =req.body
    await Board.findByIdAndUpdate({_id:id},{$pull:{User:member}})
    await User.findByIdAndUpdate({_id:member},{$pull:{Project:id}})
    return res.status(200).json({success:true,message:'Project Added Succesfully ..'})
})
export default boardRouter;