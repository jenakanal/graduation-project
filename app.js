const express = require("express")
const app = express()

const Port = process.env.PORT || 3000

require("./connection/connection")

const userRouter = require("./Router/userRouter")
const taskRouter = require("./Router/taskRouter")
app.use(express.json())

app.use(userRouter)
app.use(taskRouter)


app.listen(Port,()=>{
   console.log("app Run")
})


