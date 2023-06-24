const jwt =require ('jsonwebtoken')
const User = require ("../models/userModel")


const protect=(async(req,res,next)=>{
    let token
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            
            token=req.headers.authorization.split(" ")[1];
            const decode=jwt.verify(token,process.env.JWT_KEY)
            req.user=await User.findById(decode.id).select("-password")
            next()
        }catch(er){
            console.log(er);
        }
        
    }
    if(!token){
        res.json({error:"Not Authorized"})
    }
})

module.exports={protect}