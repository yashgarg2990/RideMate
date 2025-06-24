const app = require("./App")
const http = require("http") 
const server = http.createServer(app)
const {initializeSocket} = require('./socket')
const  port = process.env.PORT

initializeSocket(server);
server.listen(port , () =>{
    console.log(`Server is running on port ${port}`)
})
