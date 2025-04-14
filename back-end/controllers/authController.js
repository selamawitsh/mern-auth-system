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


//verify the email using OTP
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.user.id;  //  from middleware
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
            to: user.email,  //  use user.email, not undefined variable
            subject: 'Account verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`,
        };

        await transporter.sendMail(mailOption);
        res.json({ success: true, message: "Verification OTP sent on email" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
export const verifyEmail = async (req, res) => {
    const userId = req.user?.id;  // 👈 get userId from middleware
    const { otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: "missing details" });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "user not found" });
        }

        if (user.verifyOtp === " " || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "invalid otp" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "otp expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save();

        return res.json({ success: true, message: "email verified successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



//Check if user is authenticated
export const isAuthenticated = async(req,res)=>{
    try {
        return res.json({success:true})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}
//send password reset Otp
export const sendResetOtp = async (req,res)=> {
    const {email}= req.body;

    if(!email){
        return res.json({success:false, message:"email is required"})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"user not found"})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt= Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,  //  use user.email, not undefined variable
            subject: 'Password reset OTP',
            text: `Your OTP for resetting your password is ${otp}.
            Use this OTP to proceed with resetting your password`,
        };
        await transporter.sendMail(mailOption);
        return res.json({ success: true, message: "OTP sent to your email" });
        
        
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
    
}
//reset user password
export const resetPassword = async (req,res) => {
    const {email,otp,newPassword}=req.body;
    if(!email || !otp || !newPassword){
        return res.json({success:false, message:"email, OTP and new password are required"})
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            res.json({success:false, message:"user not found"})
        }
        if (user.resetOtp ===""|| user.resetOtp!=otp){
            return res.json({success:false, message:"invalid OTP"})
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success:false, message:"OTP expired"})
        }

        const hashedPassword= await bcrypt.hash(newPassword,10)
        user.password = hashedPassword;
        user.resetOtp="";
        user.resetOtpExpireAt=0;

        await user.save();

        return res.json({success:true, message:"password has been reset successfully"})
        
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
    
}