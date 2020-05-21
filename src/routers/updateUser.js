const   express = require("express"),
router = new express.Router(),
user = require("../Models/user"),
jwt = require("jsonwebtoken"),
auth = require("../Middleware/authorization"),
multer = require('multer'),
sharp = require('sharp'),
path = require("path")


//Update User
router.patch("/user/:id", auth, async(req,res)=>{
    const updationVal = Object.keys(req.body)
    const notAllowed = ["id"]
    const isValidOpr = updationVal.every((value)=> notAllowed.includes(value))
    
    if(isValidOpr){
        return res.status(400).send({error:"Invalid Updates"})
    }
    try{
        
        updationVal.forEach(function(updates){
            if (req.body[updates]){
                req.userCurrent[updates] = req.body[updates]
            }
        });

        await req.userCurrent.save()
        const userCurrent = req.userCurrent
        // res.send(req.userCurrent)
        res.render("myProfile",{userCurrent})
    }catch(e){
        res.status(500).send(e)
        console.log(e)
    }
})
module.exports = router