const express=require('express')
const { protect } = require('../middlewares/authMiddleware')
const { sendMessage, AllMessages } = require('../controller/messageRouter')
const router=express.Router()

router.post('/',protect,sendMessage)
router.get('/:chatId',protect,AllMessages)



module.exports=router
