const mongoose = require("mongoose") 
const bcrypt = require("bcryptjs")

const taskSchema = new mongoose.Schema({
        desc:{
            type: String,
            required: true
        },
        completed:{
            type: Boolean,
            default: false
        },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        }
}, {
    timestamps: true
})

const task = mongoose.model("task", taskSchema) 

module.exports = task