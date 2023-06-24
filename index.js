const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const db = require('./config/connection');
const userRouter = require('./Routes/userRouter');
const chatRoutes= require('./Routes/chatRoutes')
const cors=require('cors')


require('dotenv').config();

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}))
app.use(cookieParser());

app.use('/', userRouter);
app.use('/chat', chatRoutes);

app.listen(4000, () => {
  console.log("Connected to 4000");
});
