const express=require('express')
const router=express.Router()
const userHelper=require('../controller/userController')
const { protect } = require('../middlewares/authMiddleware')

router.post('/register',userHelper.reg)
router.post('/login',userHelper.auth)
router.get('/users',protect,userHelper.allUsers)


module.exports=router