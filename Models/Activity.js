import mongoose from 'mongoose'
const activityModel = new mongoose.Schema({
 assignee:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
 },
 changedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
 },
 changedTime:{
    type:Date,
    required:true
 },
 status:{
    type:String
 },
 task:{
   type:mongoose.Schema.Types.ObjectId,
    ref:'Tasks'
 }
})
const Activity = mongoose.model("activity",activityModel)
export default Activity;