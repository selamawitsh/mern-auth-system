import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js'
const app= express();
const port = process.env.PORT || 4000
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())
app.use(cors({ credentials: true }));


//api endpoints
app.get("/",(req,res)=>res.send("api working"));
app.use('/api/auth', authRouter)

app.listen(port,()=>console.log(`server is started on PORT: ${port}`))