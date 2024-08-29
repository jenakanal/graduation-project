const mongoose = require("mongoose")

const Task = mongoose.model("tasks",{

    title : {
        type : String,
        required : true
    },
    des :{
        type : String,
        required : true
    },
    owner :{
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'users'
    }

})


module.exports = Task