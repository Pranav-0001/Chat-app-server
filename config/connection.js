const mongoose= require('mongoose')

mongoose.connect('mongodb://localhost:27017/chat-app',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("db connected");
})