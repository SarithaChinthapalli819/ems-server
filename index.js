import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './Routes/Auth.js';
import datarouter from './Routes/Users.js';
import teamrouter from './Routes/Teams.js';
import leavesRouter from './Routes/Leaves.js';
import boardRouter from './Routes/Board.js';
import TaskRouter from './Routes/Tasks.js';


dotenv.config()
const app=express()
const corsOptions = {
    origin: 'https://ems-frontend-air2.vercel.app', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization', 'authorization'], 
    credentials: true, // Enable credentials (cookies, authorization headers)
  };
app.options('*', cors(corsOptions));
app.use(express.json())
app.use('/api/auth',router)
app.use('/api/user',datarouter)
app.use('/api/teams',teamrouter)
app.use('/api/leaves',leavesRouter)
app.use('/api/board',boardRouter)
app.use('/api/tasks',TaskRouter)
app.listen((process.env.PORT),async()=>{
    await mongoose.connect(process.env.URI)
    console.log(`server started on port ${process.env.PORT}`)
})