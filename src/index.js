const express = require("express")
const app = express()
const port = 3000
require('./db/mongoose')
const path = require("path")
const hbs = require('hbs')
bodyParser  = require("body-parser")
const cookieParser = require('cookie-parser')
const method_override = require('method-override')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static("../images")); 
 
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(method_override("_method"));

//ROUTES VARIABLES
const createUser = require("./routers/createUser")
const developer = require("./routers/developer")
const getUsers = require("./routers/getUsers")
const logInOutUser = require("./routers/logInOutUser")
const photoUser = require("./routers/photoUser")
const updateUser = require("./routers/updateUser")    

app.use(createUser)
app.use(developer)
app.use(getUsers)
app.use(logInOutUser)
app.use(photoUser)
app.use(updateUser)

//Set up handlebars Engine and views location
const viewsPath = path.join(__dirname, '../Templates/views')
const partialsPath = path.join(__dirname, '../Templates/partials')
app.set('view engine', 'hbs')
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)

app.listen(port, ()=>{
    console.log("connected to "+port)
})

