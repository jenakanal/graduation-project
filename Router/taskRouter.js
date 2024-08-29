const express = require("express")
const Task = require("../model/taskModel")
const auth = require("../midellwear/autho")
const router = express.Router()

// to add post
router.post("/task", auth ,async(req , res)=>{
    try{
        const task = await new Task({...req.body, owner : req.user._id})
        await task.save()
        res.status(200).send(task)
    }
    catch(e){
        res.status(500).send(e)
    }

})

//  to get on post by id post
router.get("/tasks/:id", auth ,async (req,res)=>{
    try{
        const _id = req.params.id
        const task = await Task.findOne({_id , owner : req.user._id})
        if (!task){
            res.status(404).send("task not found")
        }
        await task.populate('owner')
        res.status(200).send(task)
    }
    catch(e ){
        res.status(500).send(e.message)
    }
})

//  to get All posts
router.get("/tasks", auth , async (req,res)=>{
    // solution by virtual relation 
    try{
        await req.user.populate("tasks") // to get tasks
        if(req.user.tasks.length == 0){
            res.status(404).send("No Tasks for you")
        }
        res.status(200).send(req.user.tasks)
    }
    catch(e){
        res.status(500).send(e)
    }
    // anther solution to get all users
    // try{
    //     const tasks = await Task.find({owner : req.user._id})
    //     if(!tasks){
    //         res.status(404).send("No Tasks for you")
    //     }
    //     res.status(200).send(tasks)
    // }
    // catch(e){
    //     res.status(500).send(e)
    // }
})

// to edit on post
router.patch("/tasks/:id", auth ,(req,res)=>{
    const _id = req.params.id
    Task.findOneAndUpdate({_id , owner : req.user._id},req.body,{
        new:true,
        runvalidators:true
    })
    .then((task) => {
        if (!task){
            res.status(404).send("task not found")
        }
            res.status(200).send(task)
    })
       
    .catch(e => res.status(400).send(e))
})

// to delete post
router.delete("/tasks/:id", auth ,async(req,res)=>{
    try{
        const _id = req.params.id
        const task = await Task.findOneAndDelete({_id , owner : req.user._id})
        if(!task){
            res.status(404).send("TASK NOT FOUND")
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports = router