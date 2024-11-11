import express from 'express'
import Team from '../Models/Teams.js';
import User from '../Models/User.js';

const teamrouter = express.Router()
teamrouter.get('/:isActive', async (req, res) => {
    try {
        const {isActive} =req.params;
        const filter={}
        if(isActive == 1)
        {
            filter.inactiveDateTime=null
        }
        else if(isActive == 0)
        {
            filter.inactiveDateTime ={$ne:null}
        }
        const teams = await Team.find(filter).populate({
             path:'user',
            select:'name'
        })
        return res.status(200).json({ success: true, teams, message: 'Team Added Successfully' })
    }
    catch (e) {
        return res.status(401).json({ success: true, message: 'Failed' })
    }
})
teamrouter.post('/addteam', async (req, res) => {
    try {
        const { teamname } = req.body;
        const team = new Team({
            name: teamname
        })
        await team.save();
        const teams = await Team.find()
        return res.status(200).json({ success: true, teams, message: 'Team Added Successfully' })
    }
    catch (e) {
        return res.status(401).json({ success: true, message: 'Failed' })
    }
})
teamrouter.put('/editteam/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {teamname} =req.body;
        const updatedteam =await Team.findByIdAndUpdate({_id:id},{ 
            $set: { name: teamname, updatedAt: Date.now() } 
          }
        )
        
        return res.status(200).json({ success: true, updatedteam, message: 'Team Updated Successfully' })
    }
    catch (e) {
        return res.status(401).json({ success: false, message: 'Failed' })
    }
})
teamrouter.delete('/deleteteam/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteteam =await Team.findByIdAndUpdate({_id:id},{inactiveDateTime:Date.now()})
        return res.status(200).json({ success: true, message: 'Team Deleted Successfully' })
    }
    catch (e) {
        return res.status(401).json({ success: true, message: 'Failed' })
    }
})

teamrouter.post('/adduser/:teamId', async (req, res) => {
    try {
        const {userId}=req.body
        
        const { teamId } = req.params;
        await Team.findByIdAndUpdate({_id:teamId},{$push:{user:userId}})
        await User.findByIdAndUpdate({_id:userId},{team:teamId})
        return res.status(200).json({ success: true,message: 'Team Added Successfully' })
    }
    catch (e) {
        return res.status(401).json({ success: true, message: 'Failed' })
    }
})

teamrouter.get('/user/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findById({_id:teamId}).populate({
            path:'user',
            select:'name email'
        })
        return res.status(200).json({ success: true,team,message: 'Team Fetched Successfully' })
    }
    catch (e) {
        return res.status(401).json({ success: true, message: 'Failed' })
    }
})

teamrouter.put('/removeuser/:teamId', async (req, res) => {
    try {
        const {userId}=req.body
        
        const { teamId } = req.params;
        console.log(userId)
        console.log(teamId)
        const team = await Team.findByIdAndUpdate({_id:teamId},{$pull:{user:userId}},{ new: true })
        const user = await User.findByIdAndUpdate({_id:userId},{$unset:{team:''}},{ new: true })
        return res.status(200).json({ success: true,message: 'User Removed Successfully' })
    }
    catch (e) {
        return res.status(401).json({ success: false, message: 'Failed' })
    }
})
export default teamrouter;