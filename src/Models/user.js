const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const validator = require("validator")
const jwt = require("jsonwebtoken")
const task = require("./task")

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        validate(value){
            if(value < 18){
                throw new Error
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 7   
    },
    email:{
        type: String,
        require: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps: true
})

userSchema.virtual('task',{
    ref: 'task',
    localField: '_id',
    foreignField: 'author'
})

// HIDE passwords and tokens 
userSchema.methods.toJSON = function(){
    const obj = this.toObject()
    delete obj.password
    delete obj.tokens
    delete obj.avatar
    return obj
}

//Create tokens
userSchema.methods.createToken = async function(){
    const token = jwt.sign({_id: this.id.toString()}, "thisismyfirstlogin")
   
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

//Login Users
userSchema.statics.loginUser = async(email, password)=>{
    const user1 = await user.findOne({email})
    if(!user1){
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user1.password)
     if(!isMatch){
        throw new Error("Unable to login")
     }
    return user1
}

//Run before SAVE User
userSchema.pre('save', async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 8)
        next()
    }
})

//Run Before Delete User
userSchema.pre('remove', async function(next){
    await task.deleteMany({author: this._id})
    next()
})

const user = mongoose.model("user",userSchema)

module.exports = user