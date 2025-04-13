import jwt from "jsonwebtoken"

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: "Not authorized. Please login again." });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.user = { id: tokenDecode.id };  // ✅ use req.user instead of req.body
            next();
        } else {
            return res.json({ success: false, message: "Not authorized. Please login again." });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export default userAuth;

// import jwt from "jsonwebtoken"

// const userAuth = async (req,res,next)=>{
//      const {token}=req.cookies;

//      if(!token){
//         return res.json({success:false, message:"not Authorized. Login in again"})
//      }
//      try {
//         const tokenDecode=jwt.verify(token, process.env.JWT_SECRET);
//         if(tokenDecode.id){
//             req.body.userId=tokenDecode.id
//         }else{
//             return res.json({success:false, message:"not authorized. login again"})
//         }
//         next()
//      } catch (error) {
//         return res.json({success:false, message:error.message})
        
//      }
// }

// export default userAuth