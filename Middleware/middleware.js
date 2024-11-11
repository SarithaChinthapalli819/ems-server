import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../Models/User.js';
const middleware = async (req, res, next) => {
    try {
        const token =  req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: "token not found ..!!" })
        const decoded = await jwt.verify(token, "ems@123")
        if (!decoded) return res.status(401).json({ success: false, message: "token  mismatch ..!!" })
        const user = await User.findById({ _id: decoded.id })    
    
        if (!user) return res.status(401).json({ success: false, message: "user not found ..!!" })
          
        req.user = { name: user.name, id: user._id, emial: user.email,role:user.role }
        
        next()
    }
    catch (e) {
        return res.status(401).json({ success: false, message: "error ..!!" })

    }
}
export default middleware;