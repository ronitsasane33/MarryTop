const express = require("express")
const task = require("../Models/task")
const auth = require("../Middleware/authorization")
const jwt = require("jsonwebtoken")
const router = new express.Router()

//CREATE NEW TASK
router.post("/task", auth, async(req,res)=>{
    
    const task1  = new task({
        ...req.body,
        author: req.userCurrent._id
    })

    try{
        await task1.save()
        res.send(task1)
    }catch(e){
        res.status(404).send(e)
    }
})

//GET TASK
router.get("/task", auth, async(req, res)=>{
    const match ={}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    const sort ={}
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    try{
        const userPop = await req.userCurrent.populate({
            path: 'task',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(userPop.task)
    }catch(e){
        res.status(500).send(e)
    }
})

// //GET TASK BY ID
router.get("/task/:id", auth, async(req,res)=>{
    const _id = req.params.id
    try{
        const task1 = await task.findOne({_id, author: req.userCurrent._id})
        res.status(200).send(task1)

        if(!task){
            res.status(404).send()
        }
    }catch(e){
        res.status(500).send(e)
    }
})


//Update Task
router.patch("/task/:id", auth, async(req,res)=>{
   
    const givenVal = Object.keys(req.body)
    const allowedVal = ["desc", "completed"]
    const isValidOpr = givenVal.every((value)=> allowedVal.includes(value))
    const _id = req.params.id

    if(!isValidOpr){
        return res.status(400).send({error: "invalide Update"})
    }

    try{
        const taskCurrent = await task.findOne({_id, author: req.userCurrent._id})
        if(!taskCurrent){
            return res.status(404).send()
        }
        
        givenVal.forEach((doc)=> taskCurrent[doc] = req.body[doc])
        await taskCurrent.save()
        res.send(taskCurrent)

    }catch(e){
        res.status(500).send(e)
    }
})



//Delete  Task
router.delete("/task/:id", auth, async(req,res)=>{
    const _id = req.params.id 
    try{
        const taskCurrent = await task.findOneAndDelete({ _id, author: req.userCurrent._id})
        if(!taskCurrent){
            return res.status(404).send()
        }
        res.send(taskCurrent)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router