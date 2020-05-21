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


module.exports = router