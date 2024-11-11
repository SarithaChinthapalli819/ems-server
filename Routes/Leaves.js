import express from 'express'
const leavesRouter = express.Router();
import Leaves from '../Models/Leaves.js';
import middleware from '../Middleware/middleware.js';
import nodemailer from 'nodemailer'


leavesRouter.post('/applyleave', async (req, res) => {
    try {
        const {  userId,dateFrom,dateTo } = req.body
        const overlappingLeave = await Leaves.findOne({
            User: userId,
            $or: [
                { 
                    LeaveFrom: { $lte: dateTo },
                    LeaveTo: { $gte: dateFrom }
                }
            ]
        });
        console.log(overlappingLeave)
        if (overlappingLeave) {
            return res.status(400).json({
                success: false,
                message: 'Leave application overlaps with an existing leave.'
            });
        }
        
        const leaves = new Leaves({
            LeaveFrom:dateFrom,
            LeaveTo:dateTo,
            User:userId
        })
       await leaves.save();
       return res.status(200).json({success:true,message:'Leave Applied Succesfully'})
    }
    catch (e) {
        return res.status(401).json({ success: false, message: 'Error Raised..' })
    }
})

leavesRouter.get('/myleaves',middleware, async (req, res) => {
    try {
        const match={}
        match.User = req.user.id
        const leaves = await Leaves.find(match).populate({
            path:"User",
            select:"name role email",    
        })

       return res.status(200).json({success:true,leaves,message:'Leave Applied Succesfully'})
    }
    catch (e) {
        return res.status(401).json({ success: false, message: 'Error Raised..' })
    }
})


leavesRouter.get('/myApprovals/:role',middleware, async (req, res) => {
    try {
        const {role}=req.params;
        const match={}
        if(role !== 'Admin'){
            match.User = req.user.id
        }
        match.isCanceled=false
        match.isApproved=false
        match.isRejected=false
        const leaves = await Leaves.find(match).populate({
            path:"User",
            select:"name role email",    
        })
       return res.status(200).json({success:true,leaves,message:'Leave Applied Succesfully'})
    }
    catch (e) {
        return res.status(401).json({ success: false, message: 'Error Raised..' })
    }
})

leavesRouter.post('/cancelOrapproveOrreject/:id',async (req, res) => {
    try {
        const {cancel,approve,reject,email,name,leavefrom,leaveto}=req.body;
        const {id}=req.params;
        const update={}
        if(cancel){ update.isCanceled =true; update.isApproved=false;update.isRejected=false}
        else if(approve) update.isApproved =true
        else if(reject) update.isRejected =true
        update.isPending=false
        await Leaves.findByIdAndUpdate({_id:id},update)
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'chinthapallisaritha5555@gmail.com',
                pass: 'vicy flnr gkbe cqmw'
            }
        });
        let subject;
        let headerColor;
        let statusMessage;

        if (cancel) {
            subject = 'Your Leave Request Has Been Canceled';
            headerColor = '#ff9999'; 
            statusMessage = 'Your Leave Request Has Been Canceled';
        } else if (approve) {
            subject = 'Your Leave Request Has Been Approved';
            headerColor = '#99ff99'; 
            statusMessage = 'Your Leave Request Has Been Approved';
        } else if (reject) {
            subject = 'Your Leave Request Has Been Rejected';
            headerColor = '#ff9999'; 
            statusMessage = 'Your Leave Request Has Been Rejected';
        }

        const mailOptions = {
            from: 'chinthapallisaritha5555@gmail.com',
            to: `${email}`,
            subject: subject,
            html: `
                <html>
                <head>
                    <style>
                        .body-style {
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .email-container {
                            width: 70%;
                            font-family: 'Poppins', sans-serif;
                            border: 3px solid ${headerColor};
                            border-radius: 20px;
                        }
                        .header {
                            background-color: ${headerColor};
                            border-radius: 20px 20px 0 0;
                            padding: 14px;
                            text-align: center;
                        }
                        .header h2 {
                            margin: 0;
                        }
                        .content {
                            margin-top: 10px;
                            padding: 20px;
                        }
                        .content p {
                            margin: 5px 0;
                        }
                        .footer {
                            margin-top: 20px;
                            text-align: center;
                            font-size: 12px;
                            color: #6c757d;
                        }
                    </style>
                </head>
                <body class="body-style">
                    <div class="email-container">
                        <div class="header">
                            <h2>Dear ${name}!</h2>
                            <p>${statusMessage}</p>
                        </div>
                        <div class="content">
                            <p><b>Leave Details:</b></p>
                            <p><b>Name:</b> ${name}</p>
                            <p><b>Email:</b> ${email}</p>
                            <p><b>Leave From:</b> ${new Date(leavefrom).toLocaleDateString()}</p>
                            <p><b>Leave To:</b> ${new Date(leaveto).toLocaleDateString()}</p>
                        </div>
                        <div class="footer">
                            <p>If you have any questions, feel free to reach out.</p>
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
       return res.status(200).json({success:true,message:'Suuccess'})
    }
    catch (e) {
        return res.status(401).json({ success: false, message: 'Error Raised..' })
    }
})

export default leavesRouter;