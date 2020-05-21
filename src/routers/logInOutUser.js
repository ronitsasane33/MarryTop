const   express = require("express"),
router = new express.Router(),
user = require("../Models/user"),
jwt = require("jsonwebtoken"),
auth = require("../Middleware/authorization"),
multer = require('multer'),
sharp = require('sharp'),
path = require("path")


router.get('/', (req, res)=>{
    res.render('SignUp')
})


//LOG IN
router.post("/user/login", async(req,res)=>{
    try{
        const userCurrent = await user.loginUser(req.body.email,req.body.password)
        const token = await userCurrent.createToken()

        res.cookie('auth_token', token)
        const allUsers = await user.find()
        res.render("allUsers", {allUsers, token, userCurrent})
        
    }catch(e){
        
        res.status(500).send(e)
        console.log(e)
    }

})

//LOG OUT
router.get("/user/logout", auth, async(req,res)=>{
    try{
        req.userCurrent.tokens = req.userCurrent.tokens.filter((token)=>{
            return token.token !== req.token
            
        })
        await req.userCurrent.save()
        res.render("SignUp")

    }catch(e){
        res.status(500).send(e)
    }
    
})

//LOG OUT ALL
router.post("/user/logoutfromall", auth, async (req, res)=>{
    try{
        req.userCurrent.tokens = []
        await req.userCurrent.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router