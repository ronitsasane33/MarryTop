const   express = require("express"),
router = new express.Router(),
user = require("../Models/user"),
jwt = require("jsonwebtoken"),
auth = require("../Middleware/authorization"),
multer = require('multer'),
sharp = require('sharp'),
path = require("path")


// DEV : GET BY ID
router.get("/users/:id", auth, async(req,res)=>{
    try{
        const userCurrent = req.userCurrent
        const userVisit = await user.findById(req.params.id)
        if(!userVisit){
            return res.status(404).send()
        }
        res.render("profile", {userVisit, userCurrent})
    }catch(e){
        res.status(500).send()
    }
})


module.exports = router