import express from 'express'
const router = express.Router();
import User from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import middleware from '../Middleware/middleware.js';
import nodemailer from 'nodemailer'

router.post('/register', async (req, res) => {
    try {

        const { name, email, password, role } = req.body
        const user = await User.findOne({ email })
        if (user) return res.status(401).json({ success: false, message: 'User Existed..' })
        const hashpassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name: name,
            email: email,
            password: hashpassword,
            role: role
        })
        await newUser.save()
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'chinthapallisaritha5555@gmail.com',
                pass: 'vicy flnr gkbe cqmw'
            }
        });
        var mailOptions = {
            from: 'chinthapallisaritha5555@gmail.com',
            to: `${email}`,
            subject: `Added To Saritha's Employee Management System`,
            html: `
                <html>
                <head>
                    <style>
                    .body-style{
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .email-container {
                        width: 70%;
                        font-family: poppins;
                        border:3px solid #9eeaf9;
                        border-radius:20px;
                    }
                    .header {
                        background-color: #9eeaf9;
                        border-radius:20px 20px 0px 0px;
                        padding: 20px;
                        text-align: center;
                    }
                    .header h2 {
                        margin: 0;
                    }
                    .content {
                        margin-top: 10px;
                        padding: 10px;
                    }
                    .content p {
                        margin: 5px 0;
                    }
                    </style>
                </head>
                <body class="body-style">
                    <div class="email-container">
                    <div class="header">
                        <h2>Congratulations ${name}!</h2>
                        <p>You have been added to EMS on ${new Date().toLocaleDateString()}.</p>
                    </div>
                    <div class="content">
                        <p><b>Below are your login details:</b></p>
                        <p><b>Name:</b> ${name}</p>
                        <p><b>Email:</b> ${email}</p>
                        <p><b>Password:</b> ${password}</p>
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
        return res.status(200).json({ success: true, message: 'User Added Successfully..' })
    }
    catch (e) {
        return res.status(401).json({ success: false, message: 'Error Raised..' })
    }
})


router.post('/addMulitUsers', async (req, res) => {
    try {
        const {jsonData}=req.body
        console.log(jsonData)
        jsonData.forEach(async element => {
        const name=element.UserName;
        const email=element.Email;
        const role=element.Role;
        const password=element.Password;
        const user = await User.findOne({ email })
        if (user) return res.status(401).json({ success: false, message: 'User Existed..' })
        const hashpassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name: name,
            email: email,
            password: hashpassword,
            role: role
        })
        await newUser.save()
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'chinthapallisaritha5555@gmail.com',
                pass: 'vicy flnr gkbe cqmw'
            }
        });
        var mailOptions = {
            from: 'chinthapallisaritha5555@gmail.com',
            to: `${email}`,
            subject: `Added To Saritha's Employee Management System`,
            html: `
                <html>
                <head>
                    <style>
                    .body-style{
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .email-container {
                        width: 70%;
                        font-family: poppins;
                        border:3px solid #9eeaf9;
                        border-radius:20px;
                    }
                    .header {
                        background-color: #9eeaf9;
                        border-radius:20px 20px 0px 0px;
                        padding: 20px;
                        text-align: center;
                    }
                    .header h2 {
                        margin: 0;
                    }
                    .content {
                        margin-top: 10px;
                        padding: 10px;
                    }
                    .content p {
                        margin: 5px 0;
                    }
                    </style>
                </head>
                <body class="body-style">
                    <div class="email-container">
                    <div class="header">
                        <h2>Congratulations ${name}!</h2>
                        <p>You have been added to EMS on ${new Date().toLocaleDateString()}.</p>
                    </div>
                    <div class="content">
                        <p><b>Below are your login details:</b></p>
                        <p><b>Name:</b> ${name}</p>
                        <p><b>Email:</b> ${email}</p>
                        <p><b>Password:</b> ${password}</p>
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
        });
        
        return res.status(200).json({ success: true, message: 'User Added Successfully..' })
    }
    catch (e) {
        return res.status(401).json({ success: false, message: 'Error Raised..' })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ success: false, message: 'User Not Existed..' })
        const decoded = await bcrypt.compare(password, user.password)
        if (!decoded) return res.status(401).json({ success: false, message: 'Password Doesnot Match..' })
        const token = jwt.sign({ id: user._id }, "ems@123", { expiresIn: "10h" })
        return res.status(200).json({ success: true, token, user, message: 'Login Successfully..' })
    }
    catch (e) {
        return res.status(401).json({ success: false, message: 'Error Raised..' })
    }
})

router.get('/verify', middleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        if (!user) return res.status(401).json({ success: false, message: 'User Not Existed..' })
        return res.status(200).json({ success: true, user, message: 'Login Successfully..' })
    }
    catch (e) {
        return res.status(401).json({ success: false, message: 'Error Raised..' })
    }
})


router.put('/edituser/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndUpdate({ _id: id }, {
            $set: { name: req.body.name, email: req.body.email, role: req.body.role }
        })

        return res.status(200).json({ success: true, message: 'Login Successfully..' })
    }
    catch (e) {
        return res.status(401).json({ success: false, message: 'Error Raised..' })
    }
})
router.delete('/deleteuser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteuser = await User.findByIdAndUpdate({ _id: id }, { inactiveDateTime: Date.now() })
        return res.status(200).json({ success: true, message: 'User Deleted Successfully' })
    }
    catch (e) {
        return res.status(401).json({ success: true, message: 'Failed' })
    }
})

router.post('/forgotpassword', async (req, res) => {
    try {

        const {  email } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ success: false, message: 'User Not Existed..' })
        const token=jwt.sign({id:user._id},"ems@123", { expiresIn: "10h" })
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'chinthapallisaritha5555@gmail.com',
                pass: 'vicy flnr gkbe cqmw'
            }
        });
        var mailOptions = {
            from: 'chinthapallisaritha5555@gmail.com',
            to: `${email}`,
            subject: `Request To Reset Password For Employee Management System..`,
            html: `
                click <a href="https://ems-frontend-zcdk.onrender.com/resetpassword">here</a> to reset password. <br/> if this is not you then dont respond to this mail.
            `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return res.status(200).json({ success: true, token, message: 'Mail Sent To Rest Password..' })
    }
    catch (e) {
        return res.status(401).json({ success: false, message: 'Error Raised..' })
    }
})


router.post('/resetpassword', async (req, res) => {
    try {
        const { password } = req.body
        const token =req.headers.authorization.split(' ')[1];
        const decoded = await jwt.verify(token, "ems@123")
        if(!decoded) return res.status(401).json({ success: false, message: 'Token Not Found..' })          
        const hashpassword = await bcrypt.hash(password,10)
        const user = User.findByIdAndUpdate({_id:decoded.id},{password:hashpassword})   
        return res.status(200).json({ success: true, message: 'Password Updated Successfully..' })
    }
    catch (e) {
        return res.status(401).json({ success: false, message: 'Error Raised..' })
    }
})
export default router;