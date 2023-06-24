const User=require('../models/userModel')
const generateToken=require('../config/generateToken')
const reg=async(req,res)=>{
    console.log(req.body);
    const {name,email,password,pic}=req.body
    const userExist=await User.findOne({email})
    
    if(!name || !email || !password){
       
        res.status(400).json({message:"Please Provide all the Fileds"})
    }
    else if(userExist){
        res.json({message:"Email already taken"})
       
    }else{
        const user= await User.create({
            name,
            email,
            password,
            pic
        })
        if (user){
            res.status(201).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                pic:user.pic,
                token:generateToken(user._id)
            })
        }
    }
}

const auth=async(req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(user ){
        if(password===user.password){
            res.status(201).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                pic:user.pic,
                token:generateToken(user._id)
            })
        }
    }else{
        res.json({err:"Invalid Username or Password"})
    }
}

const allUsers=async(req,res)=>{
    const keyword=req.query.search ? {
        $or:[
            {name:{$regex : req.query.search, $options:"i"}},
            {email:{$regex : req.query.search, $options:"i"}}

        ]
    }:{}

    const users= await User.find(keyword).find({_id:{$ne:req.user._id}})
    console.log(users);
    res.json({...users})

}

module.exports={
    reg,
    auth,
    allUsers
}