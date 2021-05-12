// //Creating an express web server!!

const path = require('path')//Serving up the public dir
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)//Creating server outside express library and then configuring it to use our Express app then
//So that's why we did refractoring socket...as socketio expect a raw server and it can't be achieve with express here as it do its job behind the scene. 
const io = socketio(server)

//Setting up the new express server
//Listening on port 3000
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))//using express static middleware to serve the above file(that we got via path)

io.on('connection', () => {
    console.log('New WebSocket connection')//Message from server side....kind of a message that a new client get when it gets connected
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})