import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register= async (req,res)=>{
    console.log(req.body)
    const {name, email, password}=req.body;
    if (!name || !email ||!password){
        return res.json({success:false, message:"Missing deatil"})
    }
    try {
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false, message:"user already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new userModel({name, email, password:hashedPassword});
        await user.save();

        const token =jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});


        res.cookie('token', token, {
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'? 'none':'strict',
            maxAge:7*24*60*60*1000
        })
        //sending welcome email
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'welcome to MERNAUTH',
            text:`welcome to selam's first project. your account has been created with email id: ${email}`
        }
        await transporter.sendMail(mailOptions);
        return res.json({success:true})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}
export const login = async (req,res)=>{
    const {email, password}=req.body;

    if (!email || !password){
        return res.json({success:false, message: "email and password are required"})
    }
    try {
        const user= await userModel.findOne({email});
        
        if(!user){
            return res.json({sucess:false, message: "invalid email"})
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success:false, message:"invalid password"})
        }
        const token =jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});


        res.cookie('token', token, {
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'? 'none':'strict',
            maxAge:7*24*60*60*1000
        })

        return res.json({success:true})




    } catch (error) {
        return res.json({success:false, message: error.message})
    }

}

export const logout = async (req,res)=>{
    try {
        res.clearCookie('token', {
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'? 'none':'strict',
            maxAge:7*24*60*60*1000
        })
        return res.json({success:true, message:'Logged out'})

    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}

// export const sendVerifyOtp= async (req,res)=>{

//     try {
//         const {userId}=req.body;
//         const user= await userModel.findById(userId);
//         if(user.isAccountVerified){
//             return res.json({success:false, message:"account already verified"})
//         }

//         const otp = String(Math.floor(100000 + Math.random()*900000)) 
        
//         user.verifyOtp=otp;
//         user.verifyOtpExpireAt= Date.now()+24*60*60*1000

//         await user.save()
//         const mailOption ={
//             from:process.env.SENDER_EMAIL,
//             to:email,
//             subject:'Account verification OTP',
//             text:`your OTP is ${otp}. verify your account using this OTP`
            
//         }
//         await transporter.sendMail(mailOption)
//         res.json({success:true, message:"verification OTP sent on email"})
//     } 
//     catch (error) {
//         res.json({success:false, message:error.message});  
//     }
// }

export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.user.id;  // ✅ from middleware
        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,  // ✅ use user.email, not undefined variable
            subject: 'Account verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`,
        };

        await transporter.sendMail(mailOption);
        res.json({ success: true, message: "Verification OTP sent on email" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const verifyEmail = async(req, res)=>{
    const {userId, otp}=req.body
    if(!userId || !otp){
        res.json({success:false, message: "missing details"})
    }
    try {
        const user = await userModel.findById(userId);
        
        if(!user){
            return res.json({success:false, message:"user not founf"})
        }

        if(user.verifyOtp===" " || user.verifyOtp!==otp){
            return res.json({success:false, message: "invalid otp"})
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false, message: "otp expired"})
        }
        user.isAccountVerified = true;
        user.verifyOtp="";
        user.verifyOtpExpireAt=0;
        await user.save()
        return res.json({success:true, message: "email verified successfully"})
        
    } catch (error) {
        return res.json({success:false, message:error.message})
        
    }
}