const   express = require("express"),
router = new express.Router(),
user = require("../Models/user"),
jwt = require("jsonwebtoken"),
auth = require("../Middleware/authorization"),
multer = require('multer'),
sharp = require('sharp'),
path = require("path")

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

//CREATE NEW USER
router.post("/user", upload.single('avatar'), async(req, res)=>{
    const user1 = new user(req.body)  
    try{
        const userCurrent = await user1.save()
        const token = await userCurrent.createToken()
        const bufferSharp = await sharp(req.file.buffer).png().toBuffer()
        userCurrent.avatar = bufferSharp
        res.cookie('auth_token', token)
        //res.sendFile(path.resolve(__dirname, '../../Templates', 'views', 'private.html'))
        await userCurrent.save()

        // const allUsers = await user.find()
        res.render("DetailForm", {userCurrent})
       //res.render("profile",{userCurrent,token})
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router