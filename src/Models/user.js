const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const validator = require("validator")
const jwt = require("jsonwebtoken")
const task = require("./task")

const userSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
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
// Basic info
    height :{
        type: String
    },
    weight:{
        type: String
    },
    language:{
        type: String
    },
    body_type :{
        type: String
    },
    complexion:{
        type: String
    },
    marital_status:{
        type:String
    },
// RELIGION  
    religion:{
        type: String
    },
    caste:{
        type: String
    },
    gothram:{
        type: String
    },
    rashi:{
        type: String
    },
    mother_tounge:{
        type: String
    },
// Life Style
    eating_habit:{
            type: String
        },
    drinking_habit:{
        type: String
    },
    smoking_habit:{
        type: String
    },

// Work Details  
    occupation:{
        type: String
    },
    company :{
        type: String
    },
    salary:{
        type: String
    },
    education:{
        type: String
    },
    education_details:{
        type: String
    },
// Family Details
    family_type:{
        type: String
    },
    fathers_status:{
        type: String
    },
    mothers_status:{
        type: String
    },
    relatives_status:{
        type: String
    },
    brothers:{
        type: Number
    },
    sisters:{
        type: String
    },
    native_place:{
        type: String
    },
// LOCATION  
    country:{
        type: String
    },
    city:{
        type: String
    },
    state:{
        type: String
    },
    citizenship:{
        type: String
    },
    residential_status:{
        type: String
    },
//CONTACT INFO
    contact_number:{
        type: String
    },
    parents_contact:{
        type: String
    },
// Other
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