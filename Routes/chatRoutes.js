const express=require('express')
const { protect } = require('../middlewares/authMiddleware')
const { accessChat, fetchChat, createGroup, renameGroup, addGroup, removeGroup } = require('../controller/chatController')
const router=express.Router()

router.post("/",protect,accessChat)
router.get("/",protect,fetchChat)
router.post("/group",protect,createGroup)
router.put("/grouprename",protect,renameGroup)
router.put("/groupremove",protect,removeGroup)
router.put("/groupadd",protect,addGroup)

module.exports=router