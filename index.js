import express from 'express'
import cors from 'cors'
import connectDB from './Database/db.js'
import dotenv from 'dotenv';
import router from './Routes/Auth.js';
import datarouter from './Routes/Users.js';
import teamrouter from './Routes/Teams.js';
import leavesRouter from './Routes/Leaves.js';
import boardRouter from './Routes/Board.js';
import TaskRouter from './Routes/Tasks.js';


dotenv.config()
const app=express()
app.use(cors())
app.use(express.json())
app.use('/api/auth',router)
app.use('/api/user',datarouter)
app.use('/api/teams',teamrouter)
app.use('/api/leaves',leavesRouter)
app.use('/api/board',boardRouter)
app.use('/api/tasks',TaskRouter)
app.listen((process.env.PORT),()=>{
    connectDB()
    console.log(`server started on port ${process.env.PORT}`)
})