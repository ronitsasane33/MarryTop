const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1/taskmanager",{
    useNewUrlParser: true,
    useCreateIndex: true}).then(()=>{
        console.log("Connected to MongoDb")
    }).catch((e)=>{
        console.log(e)
})
