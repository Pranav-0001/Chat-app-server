const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const db = require('./config/connection');
const userRouter = require('./Routes/userRouter');
const chatRoutes= require('./Routes/chatRoutes')
const messageRoutes= require('./Routes/messageRoutes')
const cors=require('cors')


require('dotenv').config();

app.use(express.json());
// app.use(cors({
//   origin: ["http://localhost:3000"],
//   methods: ["GET", "POST" , "PUT"],
//   credentials: true
// }))
app.use(cors());
app.use(cookieParser());

app.use('/', userRouter);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);

const server=  app.listen(4000,'0.0.0.0', () => {
  console.log("Connected to 4000");
});

const io=require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:"*",
  },

})

io.on("connection",(socket)=>{
  console.log("connected to sockrt io");

  socket.on('setup',(userData)=>{
    console.log(userData?._id);
    socket.join(userData?._id)
    socket.emit("connected")
  })

  socket.on('join chat',(room)=>{
    socket.join(room)
    console.log('user Joined room : '+room);
  })

  socket.on('new message', (newMessageRecieved)=>{
    var chat = newMessageRecieved.chat
    if(!chat.users) return console.log("chat not found");
    chat.users.forEach(user => {
      if(user._id == newMessageRecieved.sender._id) return
      socket.in(user._id).emit("message recieved",newMessageRecieved)
    });
  })

  socket.off("setup",()=>{
    console.log("User Disconnected");
    socket.leave(userData._id)
  })
})