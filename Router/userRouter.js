const express = require("express")
const User = require("../model/userModel")
const auth = require("../midellwear/autho")


const router = express()
// add user
router.post("/users" , async (req,res)=>{
    try{
        const user =  await new User(req.body)
        const token = await user.generateToken() // to creat token to use app
        await user.save()
        res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

// get all users
router.get("/users" ,auth, async (req,res)=>{
    try{
        const users = await User.find({})
        res.status(200).send(users)
    }
    catch(e){
        res.status(400).send(e.message)
}

})

// get one person by id
router.get("/users/:id",auth ,async (req,res)=>{
    try{
        const id = req.params.id
        const user = await User.findById(id)
        if(!user){
            res.status(400).send("user not found")
        }
        res.status(200).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

// update person data
router.patch("/users/:id" ,auth , async (req,res)=>{
    try{
        const updates = Object.keys (req.body) // to get the ksey you update
        const _id = req.params.id
        const user = await User.findById (_id)
        if(!user){
            return res.status(404).send('No user is found')
        }
        updates.forEach((ele) => (user[ele] = req.body[ele])) // user. key you updata = user . value you updata
        await user.save() // to save upate and hash password befor update
        res.status(200).send(user)
    }
    catch(error){
        res.status(400).send(error)
    }

    // حل تانى ولكن مش عارفة ايه مشكلته مش بيرضى يعمل حفظ للداتا
    // try{
    //     const id = req.params.id
    //     let user = await User.findById(id)
    //         if(!user){
    //             res.status(404).send("user not found")
    //         }
    //     // console.log({...user._doc}) لما نطبع ال user هنفهم ليه كتابنها كدة
    //     user = { ...user._doc, ...req.body}
    //     console.log(user,100)
    //     await user.save()

    //     res.status(200).send(user)
    // }
    // catch(e){
    //     res.status(500).send(e.message)
    // }
})

// delet all data
router.delete("/users" , auth ,async (req,res)=>{
    try{
        await User.deleteMany({})
        res.status(200).send("delete")
    }
    catch(e){
        res.status(400).send(e.message)
}

})

// delete data by id
router.delete("/users/:id", auth ,async (req,res)=>{
    try{
        const id = req.params.id
        const user = await User.findByIdAndDelete(id)
        if(!user){
            res.status(400).send("user not found")
        }
        res.status(200).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

// show my profile 
router.get("/profile",auth, async(req,res)=>{
    try{
        res.status(200).send(req.user) // show user by auth
    }
    catch(e){
        res.status(400).send(e)
    }
})

// login 
router.post("/login", async (req,res)=>{
    try{
        const user = await User.logIn(req.body.email,req.body.password)
        const token = await user.generateToken() // to creat token to use app
        res.status(200).send({user,token})
    }

    catch(e){
        res.status(400).send(e)
    }
})

// log out
router.delete("/logout", auth ,async(req,res)=>{
    try{
        req.user.tokens
        req.user.tokens = req.user.tokens.filter((ele) =>{
            return ele !== req.token
        })
        await req.user.save()
        res.status(200).send("log out")
    }
    catch(e){
        res.status(400).send(e)
    }
    
    
})

// log out All
router.delete("/logoutAll" , auth, (req,res)=>{
    req.user.tokens = []
    req.user.save()
    .then(res.status(200).send("log out All"))
    .catch((e)=> res.status(500).send(e))
})


module.exports = router