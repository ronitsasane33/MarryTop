const express = require("express")
const app = express()
const port = process.env.PORT
require('./db/mongoose')

//ROUTES VARIABLES
const routerUser = require("./routers/users")
const routerTask = require("./routers/task")

app.use(express.json())
app.use(routerTask)
app.use(routerUser)

app.listen(port, ()=>{
    console.log("connected to "+port)
})

