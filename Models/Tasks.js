import mongoose from "mongoose";

const TasksModel=new mongoose.Schema({
    taskName:{
        required:true,
        type:String
    },
    assignee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    Project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Board'
    },
    deadLineDate:{
        required:true,
        type:Date
    },
    status:{
        type:String,
        default:'New'
    },
    priority:{
        type:String,
        required:true
    }
})

const Tasks=mongoose.model("Tasks",TasksModel)
export default Tasks;