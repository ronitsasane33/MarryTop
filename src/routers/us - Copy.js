const   express = require("express"),
router = new express.Router(),
user = require("../Models/user"),
jwt = require("jsonwebtoken"),
auth = require("../Middleware/authorization"),
multer = require('multer'),
sharp = require('sharp'),
path = require("path")


//Get all Users
router.get("/users", auth, async(req, res)=>{
    try{    
        //*** res.send({user1 : user1.toJSON(), token})   IS SAME AS BELOW bcoz of toJSON method
        const userCurrent = req.userCurrent
        const allUsers = await user.find()
        res.render("allUsers", {allUsers, userCurrent})
    }catch(e){
        res.status(500).send(e)
    }
} )

module.exports = router