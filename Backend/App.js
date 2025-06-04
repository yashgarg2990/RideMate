
const dotenv  = require("dotenv")

dotenv.config()
const cookieParser = require("cookie-parser")

const express =  require("express")

const app = express()

const userRoutes = require("./routes/user.routes")
const captainRoutes = require("./routes/captain.routes")

const cors = require("cors")

const connectDB = require('./db/dc_connect')

connectDB() 
app.use(cookieParser())


app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get("/" , (req , res) =>{
    res.send("Hello World")
})
app.use('/user', userRoutes) 
app.use('/captains', captainRoutes)


module.exports = app  ;
