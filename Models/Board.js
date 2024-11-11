import mongoose from 'mongoose'
const BoardModel=new mongoose.Schema({
    projectName:{
        required:true,
        type:String
    },
    inActiveDateTime:{
        default:null,
        type:Date
    },
    User:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
})
const Board=mongoose.model("Board",BoardModel)
export default Board;