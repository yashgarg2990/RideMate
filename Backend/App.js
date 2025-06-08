
const dotenv  = require("dotenv")

dotenv.config()
const cookieParser = require("cookie-parser")

const express =  require("express")

const app = express()

const userRoutes = require("./routes/user.routes")
const captainRoutes = require("./routes/captain.routes")
const mapsRoutes = require("./routes/maps.routes")

const cors = require("cors")
// allow local host  5173 access
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true, // allow cookies to be sent
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}
app.use(cors(corsOptions))




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
app.use('/maps' , mapsRoutes)

module.exports = app  ;
