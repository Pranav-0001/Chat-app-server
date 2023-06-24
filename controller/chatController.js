const { json } = require("body-parser")
const Chat= require("../models/chatModel")
const User = require("../models/userModel")

const accessChat=async(req,res)=>{
    const {userId} = req.body
    if (!userId){
     return  res.json({error:"Something went wrong"})
    }

    var ischat= await Chat.find({
        isGroup:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}},

        ]
    }).populate("users","-password")
    .populate("latestMessage")

    ischat= await User.populate(ischat,{
        path:"latestMessage.sender",
        select:"name pic email"
    })

    if(ischat.length>0){
        res.json(ischat[0])
    }else{
        var chatData= {
            chatName:"sender",
            isGroup:false,
            users:[req.user._id,userId]
        }
        try {
            const createdChat = await Chat.create(chatData)
            const FullChat= await Chat.findOne({_id:createdChat._id}).populate("users","-password") 

            res.json({FullChat})
        } catch (error) {
            console.log(error);
        }
    }
}


const fetchChat=(req,res)=>{
    try{
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}}).populate("users","-password").populate("groupAdmin","-password").populate("latestMessage").sort({updatedAt:-1}).then(async(results)=>{
            results=await User.populate(results,{
                path:"latestMessage.sender",
                select:"name pic email"
            })
            res.json(results)
        })
    }catch(error){
        console.log(error);
    }
}

const createGroup =async(req,res)=>{
    var {users,name}=req.body
    if(!users || !name){
        return res.json({error:"Please fill all the fileds"})
    }
    users=JSON.parse(users)
    if(users.length<2){
        return res.json({error:"More than 2 users required to form a group chat "})

    }
    users.push(req.user);
    try{
        const groupChat=await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroup:true,
            groupAdmin:req.user
        })
        const fullGroupChat = await Chat.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        res.json(fullGroupChat)
    }catch(err){
        console.log(err);
    }
    
}

const renameGroup=async(req,res)=>{
    const {chatId,chatName} = req.body
    const updatedChat= await Chat.findByIdAndUpdate(chatId,{
        chatName,
    },{
        new:true
    }).populate("users","-password")
    .populate("groupAdmin","-password")
    if(!updatedChat){
         res.json({err:"Chat not found"})
    }else{
        res.json(updatedChat)
    }
}

const addGroup=async(req,res)=>{
    const {chatId,userId}=req.body
    console.log(req.body);
    const added=await Chat.findByIdAndUpdate(chatId,
        {
            $push:{users:userId},
            
        },{new:true}
        ).populate("users","-password")
        .populate("groupAdmin","-password")

        if(!added){
            res.json({error:"chat not found"})
        }else{
            res.json(added)
        }
}

const removeGroup=async(req,res)=>{
    const {chatId,userId}=req.body
    const added=await Chat.findByIdAndUpdate(chatId,
        {
            $pull:{users:userId},
            
        },{new:true}
        ).populate("users","-password")
        .populate("groupAdmin","-password")

        if(!added){
            res.json({error:"chat not found"})
        }else{
            res.json(added)
        }
}

module.exports={
    accessChat,
    fetchChat,
    createGroup,
    renameGroup,
    addGroup,
    removeGroup
    
}