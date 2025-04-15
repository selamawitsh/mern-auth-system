import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";


const app= express();
const port = process.env.PORT || 4000
connectDB();
const allowedOrigins =['http://localhost:5173']


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())
// app.use(cors({ origin: allowedOrigins, credentials: true }));
const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  };
  
  app.use(cors(corsOptions));


//api endpoints
app.get("/",(req,res)=>res.send("api working"));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port,()=>console.log(`server is started on PORT: ${port}`))