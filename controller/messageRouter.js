const Chat = require('../models/chatModel')
const Message= require('../models/messageModel')
const User = require('../models/userModel')


const sendMessage =async(req,res)=>{
    const {content,chatId}= req.body
    if(!content || !chatId){
        return res.json({error:"Invalid data"})
    }

    var newMessage = {
        sender:req.user._id,
        content:content,
        chat:chatId
    }

    try { 
        var message= await Message.create(newMessage)
        message= await message.populate("sender","name pic")
        message= await message.populate("chat")
        message= await User.populate(message,{
            path:'chat.users',
            select:"name pic email"
        })

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        })
        res.json(message)
    }catch(err){
        console.log(err);
    }
}


const AllMessages=async(req,res)=>{
   try {
    const messages = await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat")
    res.json(messages)
   } catch (error) {
    
   }
}


module.exports={
    sendMessage,
    AllMessages
}