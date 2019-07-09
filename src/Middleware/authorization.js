const jwt = require("jsonwebtoken")
const user = require("../Models/user")

const auth = async (req,res,next) => {
        try{
            const token = req.header("Authorization").replace("Bearer ","") 
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const userCurrent = await user.findOne({_id : decoded._id, 'tokens.token' : token})
          
            if(!userCurrent){
                throw new Error()
            }
            req.token = token
            req.userCurrent = userCurrent 
            next()
        }catch(e){
            res.status(401).send({error : "Please Log in"})
        }
}

module.exports = auth
