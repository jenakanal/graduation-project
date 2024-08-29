
const mongoose = require("mongoose")
 const bcrypt = require("bcrypt")
 const validator = require("validator")
const jwt = require("jsonwebtoken")
const { param } = require("../Router/userRouter")

const UserSchema = new mongoose.Schema({

    Fname : {
        type : String,
        required : true,
        trim : true,
        minLength: 2,
        maxLength: 10
    },
    Lname :{
        type : String,
        required : true,
        trim : true,
        minLength: 2,
        maxLength: 10
    },
    email :{
        type : String,
        required : true,
        trim : true,
        unique : true,
        validate (val){
            if(!validator.isEmail(val)){
                throw new Error("Email is valied")
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minLength : 8,
        match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

    },
    age : {
        type : Number,
        default : 18,
        validate(val){
            if(val<=0){
                throw new Error("age must be positive number")
            }
        }
    },
    city : {
        type : String
    },
    tokens : [
        {
            type:String,
            required : true
        }
    ]
})

UserSchema.pre ("save" , async function ()  {
    const user = this 
 if (this.isModified("password"))
     this.password = await bcrypt.hash(this.password, 10)
})
// findOneAndUpdate حل تانى فى حالة استخدام
//   UserSchema.pre('findOneAndUpdate', async function() {
//     const update = this.getUpdate();
//     if (update.password) {
//       // تشفير كلمة المرور إذا تم تعديلها
        // طالما كتبت password فى ال postman يبقى تم تعديها
//       update.password = await bcrypt.hash(update.password, 10);
//     }
//     next();
//   });
 
UserSchema.statics.logIn = async function(email,password){
    const user = await User.findOne({email})
    if(!user){
        throw new Error("unable to log in email")
    }
    const pass = await bcrypt.compare(password,user.password)
    if(!pass){
        throw new Error("unable to log in password")
    }
    return user
}

UserSchema.methods.generateToken = async function(){
    const user = this
    const token = await jwt.sign ({_id:user._id },"key")
    user.tokens = user.tokens.concat(token)
    await user.save()
    return token
}

UserSchema.methods.toJSON = function (){
    const user = this
    const newUser = user.toObject()
    delete newUser.password
    delete newUser.tokens
    return newUser
}

UserSchema.virtual("tasks",{
    ref : "tasks",
    localField : "_id",
    foreignField : "owner"
})


const User = mongoose.model("users" , UserSchema)
module.exports = User