const   express = require("express"),
        router = new express.Router(),
        user = require("../Models/user"),
        jwt = require("jsonwebtoken"),
        auth = require("../Middleware/authorization"),
        multer = require('multer'),
        sharp = require('sharp')

//CREATE NEW USER
router.post("/user", async(req, res)=>{
    
    const user1 = new user(req.body)
    try{
        const a = await user1.save()
        const token = await user1.createToken()

        res.send({a,token})
    }catch(e){
        res.status(500).send(e)
    }
})

//LOG IN
router.post("/user/login", async(req,res)=>{
    try{
        
        const user1 = await user.loginUser(req.body.email,req.body.password)
        
        const token = await user1.createToken()
        
        //*** res.send({user1 : user1.toJSON(), token})   IS SAME AS BELOW bcoz of toJSON method
        res.send({user1, token})
        
    }catch(e){
        
        res.status(500).send(e)
        console.log(e)
    }

})

//GET MY PROFILE
router.get("/user/me",auth, async(req,res)=> {
   res.send(req.userCurrent)
})

//LOG OUT
router.post("/user/logout",auth, async(req,res)=>{
    try{
        req.userCurrent.tokens = req.userCurrent.tokens.filter((token)=>{
            return token.token !== req.token
            
        })
        await req.userCurrent.save()
        res.send()

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

//Update User
router.patch("/user/:id", auth, async(req,res)=>{
    const updationVal = Object.keys(req.body)
    const allowed = ["name", "id", "age", "password"]
    const isValidOpr = updationVal.every((value)=> allowed.includes(value))
    
    if(!isValidOpr){
        return res.status(400).send({error:"Invalid Updates"})
    }
    
    try{
        
        updationVal.forEach((updates)=> req.userCurrent[updates] = req.body[updates])

        await req.userCurrent.save()
        res.send(req.userCurrent)
    }catch(e){
        res.status(500).send(e)
        console.log(e)
    }
})


//UPLOAD AVATAR PRE work---------------------------------------------AVATAR-------------------------
const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, callBack){
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return callBack(new Error("please upload image"))
        }
        callBack(undefined, true)
    }
})

//ROUTE UPLOAD AVATAR
router.post("/user/me/avatar", auth, upload.single('up'), async(req, res)=>{
    const bufferSharp = await sharp(req.file.buffer).png().toBuffer()
    req.userCurrent.avatar = bufferSharp
    await req.userCurrent.save()
    res.send()
},(error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

//ACCESS AVATAR
router.get("/user/:id/avatar", async(req, res)=>{
    try{
        const userCurrent = await user.findById(req.params.id)
        if(!userCurrent || !userCurrent.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(userCurrent.avatar)

    }catch(e){
        console.log(e)
        res.status(404).send()
    }
    
})

//DELETE AVATAR
router.delete("/user/me/avatar", auth, async(req, res)=>{
    try{
        req.userCurrent.avatar = undefined
        await req.userCurrent.save()
        res.send()
    }catch(e){
        res.status(404).send()
    }
})

//-------------------------------------------------------------------------------------AVATAR END-----------------------------

// DEV : GET BY ID
router.get("/user/:id", async(req,res)=>{
    try{
        const usercurrent = await user.findById(req.params.id)
        if(!usercurrent){
            return res.status(404).send()
        }
        res.status(200).send(usercurrent)
        //res.status(200).render("user", {userCurrent})
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router