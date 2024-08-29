const User = require("../model/userModel")
const jwt = require("jsonwebtoken")

const auth = async (req,res,next)=>{
    try{
        const token = req.header("Authorization").replace("Bearer ","")
        // console.log(token,20200)
        const decode = jwt.verify(token,"key")
        // console.log(decode,100)
        const user = await User.findOne({_id:decode._id,tokens:token})
        // console.log(user)

        if (!user){
            throw new Error("Not found")
        }

        req.user = user
        req.token = token
        next()
    }
    catch(e){
        res.status(400).send("please authencation")
    }
    
}


module.exports = auth