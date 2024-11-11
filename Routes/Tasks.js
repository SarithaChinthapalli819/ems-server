import express from 'express'
import Tasks from '../Models/Tasks.js';
import middleware from '../Middleware/middleware.js';
import nodemailer from 'nodemailer'
import Board from '../Models/Board.js';
import User from '../Models/User.js';
import Activity from '../Models/Activity.js';
import cron from 'node-cron';

const TaskRouter=express.Router()
TaskRouter.post('/AddTasks',middleware,async(req,res)=>{
    const {taskName,userId,selectedDateFrom,projectId,priority}=req.body
    const tasks=await new Tasks({
    taskName:taskName,
    assignee:userId,
    Project:projectId,
    deadLineDate:selectedDateFrom,
    priority:priority
    })
    
    
    const project =await  Board.find({_id:projectId})
    const user = await User.find({_id:userId})
    tasks.save()
    var transporter = nodemailer.createTransport({
        service: 'gmail',    
        auth: {
            user: 'chinthapallisaritha5555@gmail.com',
            pass: 'vicy flnr gkbe cqmw'
        }
    });
    let color;
    if(priority == 'P0 Critical'){
        color='rgb(254, 2, 4)'
    }
    else if(priority == 'P1 High'){
        color='rgb(254, 126, 2)'
    }
    else if(priority == 'P2 Medium'){
        color='rgb(0, 191, 255)'
    }
    else if(priority === 'P3 Low'){
        color='rgb(123, 123, 123)'
    }
    const mailOptions = {
        from: 'chinthapallisaritha5555@gmail.com',
        to: `${user[0].email}`,
        subject: 'New Task Assigned to You',
        html: `
            <html>
            <head>
                <style>
                    .body-style {
                        display: flex;
                        justify-content: center;
                        background-color: #f5f5f5;
                        padding: 20px;
                    }
                    .email-container {
                        width: 100%;
                        max-width: 600px;
                        font-family: 'Poppins', sans-serif;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        overflow: hidden;
                        background-color: #ffffff;
                    }
                    .header {
                        background-color: #70ad47;
                        padding: 20px;
                        text-align: center;
                        color: #ffffff;
                    }
                    .header h2 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .header p {
                        margin: 5px 0 0;
                        font-size: 16px;
                    }
                    .content {
                        padding: 20px;
                        color: #333333;
                    }
                    .content p {
                        margin: 10px 0;
                        font-size: 14px;
                        line-height: 1.6;
                    }
                    .highlight {
                        font-weight: bold;
                        color: #70ad47;
                    }
                    .footer {
                        padding: 15px;
                        text-align: center;
                        font-size: 12px;
                        color: #6c757d;
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body class="body-style">
                <div class="email-container">
                    <div class="header">
                        <h2>Hello ${user[0].name}!</h2>
                        <p>A New Task Has Been Assigned to You</p>
                    </div>
                    <div class="content">
                        <p>Dear ${user[0].name},</p>
                        <p>We are pleased to inform you that <span class="highlight">${req.user.name}</span> has assigned a new task to you as part of the project:</p>
                        <p><strong>Project Name:</strong> <span class="highlight">${project[0].projectName}</span></p>
                        <p><strong>Priority Level:</strong> <span style="color:${color}">${priority}</span></p>
                        <p><strong>Deadline:</strong> <span class="highlight">${new Date(selectedDateFrom).toLocaleDateString()}</span></p>
                        <p>We encourage you to log into the management portal, review the task details, and begin your work.</p>
                    </div>
                    <div class="footer">
                        <p>Best of luck,<br>Management Portal Team</p>
                        <p>For any assistance, please contact support.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    return res.status(200).json({success:true,message:'Task Addedd Successfully..'})
})

TaskRouter.get('/getTasks/:id',middleware,async(req,res)=>{
    const {id}=req.params
    
    const tasks=await Tasks.find({Project:id}).populate({
        path:'assignee',
        select:'name'
    }).populate({
        path:'Project',
        select:'projectName'
    })
    
    return res.status(200).json({success:true,tasks,message:'Task Addedd Successfully..'})
})


TaskRouter.get('/getAllTasks',async(req,res)=>{
    
    const tasks=await Tasks.find().populate({
        path:'assignee',
        select:'name'
    }).populate({
        path:'Project',
        select:'projectName'
    })
    
    return res.status(200).json({success:true,tasks,message:'Fetched Usewr Tasks Successfully..'})
})

TaskRouter.get('/getMyTasks/:role',middleware,async(req,res)=>{
    const {role}=req.params
    const match ={}
    if(role != 'Admin'){
        match.assignee=req.user.id     
    }
    const tasks=await Tasks.find(match).populate({
        path:'assignee',
        select:'name'
    }).populate({
        path:'Project',
        select:'projectName'
    })
    
    return res.status(200).json({success:true,tasks,message:'Fetched Usewr Tasks Successfully..'})
})

TaskRouter.put('/updateTasks/:id',async(req,res)=>{
    const {id}=req.params
    
    const {taskName,userId,selectedDateFrom,projectId,priority}=req.body
    const tasks =await Tasks.findByIdAndUpdate({_id:id},{
        taskName:taskName,
        assignee:userId,
        deadLineDate:selectedDateFrom,
        Project:projectId,
        priority:priority
    })
    return res.status(200).json({success:true,tasks,message:'Task Updated Successfully..'})
})


TaskRouter.delete('/deleteTasks/:id',async(req,res)=>{
    const {id}=req.params
    const tasks =await Tasks.findByIdAndDelete({_id:id})
    return res.status(200).json({success:true,tasks,message:'Task Deleted Successfully..'})
})

TaskRouter.put('/updateTaskStatus/:id',middleware,async(req,res)=>{
    const {id}=req.params
    const {title}=req.body
    const tasks =await Tasks.findByIdAndUpdate({_id:id},{
        status:title
    })
    const tasksdata = await Tasks.findById({_id:id})
    const activity = new Activity({
        assignee:tasksdata.assignee,
        changedBy:req.user.id,
        changedTime:new Date(),
        status:title,
        task:id
    })
    activity.save()
    return res.status(200).json({success:true,tasks,message:'Task Updated Successfully..'})
})

TaskRouter.get('/getActivityData',async(req,res)=>{
    const activity = await Activity.find().populate({
        path:'assignee',
        select:'name'
    }).populate({
        path:'changedBy',
        select:'name'
    }).populate({
        path:'task',
        select:'taskName'
    })
    return res.status(200).json({success:true,activity,message:'Task Updated Successfully..'})
})

cron.schedule('26 14 * * *', async() => {
    const tasks =await Tasks.find().populate({
        path:'assignee',
        select:'name email'
    }).populate({
        path:'Project',
        select:'projectName'
    })
   
    tasks.forEach(task=>{
       
        if(task.status != 'QA Approved' && new Date(task.deadLineDate).toLocaleDateString() === new Date().toLocaleDateString())  
        {
            console.log(task)
            let color;
            if(task.status == 'New'){
                color='rgb(183, 183, 183)'
            }
            else if(task.statusstatus == 'In Progress'){
                color='rgb(51, 178, 255)'
            }
            else if(task.status == 'Dev Completed'){
                color='rgb(112, 173, 71)'
            }
            else if(task.status === 'Deployed'){
                color='rgb(54, 194, 196)'
            }
            else if(task.status === 'Ready for QA'){
                color='rgb(81, 187, 82)'
            }
            let prioritycolor;
            if(priority == 'P0 Critical'){
                prioritycolor='rgb(254, 2, 4)'
            }
            else if(priority == 'P1 High'){
                prioritycolor='rgb(254, 126, 2)'
            }
            else if(priority == 'P2 Medium'){
                prioritycolor='rgb(0, 191, 255)'
            }
            else if(priority === 'P3 Low'){
                prioritycolor='rgb(123, 123, 123)'
            }
            var transporter = nodemailer.createTransport({
                service: 'gmail',    
                auth: {
                    user: 'chinthapallisaritha5555@gmail.com',
                    pass: 'vicy flnr gkbe cqmw'
                }
            });
            const mailOptions = {
                from: 'chinthapallisaritha5555@gmail.com',
                to: `${task.assignee.email}`,
                subject: 'New Task Assigned to You',
                html:`
                 <html>
                <head>
                    <style>
                        body {
                            font-family: 'Poppins', sans-serif;
                            background-color: #f5f5f5;
                            padding: 20px;
                            display: flex;
                            justify-content: center;
                        }
                        .email-container {
                            width: 100%;
                            max-width: 600px;
                            background-color: #ffffff;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            overflow: hidden;
                        }
                        .header {
                            background-color: #ff4d4d; /* Red for pending tasks */
                            padding: 20px;
                            text-align: center;
                            color: #ffffff;
                        }
                        .header h2 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .header p {
                            margin: 5px 0 0;
                            font-size: 16px;
                        }
                        .content {
                            padding: 20px;
                            color: #333333;
                        }
                        .content p {
                            margin: 10px 0;
                            font-size: 14px;
                            line-height: 1.6;
                        }
                        .highlight {
                            font-weight: bold;
                            color: #70ad47;
                        }
                        .footer {
                            padding: 15px;
                            text-align: center;
                            font-size: 12px;
                            color: #6c757d;
                            background-color: #f9f9f9;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                         <div class="header">
                            <h2>Attention Required: Task Pending!</h2>
                            <p>Your action is required for the task listed below.</p>
                        </div>
                        <div class="content">
                            <p>Dear ${task.assignee.name},</p>
                            <p>We are pleased to inform you that, your task is still in <span style="color:${color}">${task.status}</span>.</p>
                            <p><strong>Task Details:</strong></p>
                            <p><strong>Project Name:</strong> <span class="highlight">${task.Project.projectName}</span></p>
                            <p><strong>Priority Level:</strong> <span style="color:${prioritycolor}">${task.priority}</span></p>
                            <p><strong>Deadline:</strong> <span class="highlight">${new Date(task.deadLineDate).toLocaleDateString()}</span></p>
                            <p>Please log into the management portal and complete the task as soon as possible.</p>
                        </div>
                        <div class="footer">
                            <p>Best regards,<br>Management Portal Team</p>
                            <p>For any assistance, please contact support.</p>
                        </div>
                    </div>
                </body>
                </html>
                `
            };
            
        
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    })
})
export default TaskRouter;