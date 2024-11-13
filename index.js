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
    origin: ['http://localhost:5173','https://ems-frontend-zcdk.onrender.com'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'authorization'], 
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.static(path.resolve('build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
app.use('/api/auth',router)
app.use('/api/user',datarouter)
app.use('/api/teams',teamrouter)
app.use('/api/leaves',leavesRouter)
app.use('/api/board',boardRouter)
app.use('/api/tasks',TaskRouter)
app.listen((process.env.PORT),async()=>{
    await mongoose.connect(process.env.URI,{dbName:'EMS'})
    console.log(`server started on port ${process.env.PORT}`)
})