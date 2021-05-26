//Creating an express web server!!

const path = require('path')//Serving up the public dir
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage,generateLocationMessage } = require('./utils/messages') //will return the object thart is exported
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)//Creating server outside express library and then configuring it to use our Express app then
//So that's why we did refractoring socket...as socketio expect a raw server and it can't be achieve with express here as it do its job behind the scene. 
const io = socketio(server)

//Setting up the new express server
//Listening on port 3000
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))//using express static middleware to serve the above file(that we got via path)




io.on('connection', (socket) => {
    console.log('New WebSocket connection')//Message from server side....kind of a message that a new client get when it gets connected

    socket.on('join', (options, callback) => {
        //we will get id from socket.id every connection has its own unique id
        const { error, user } = addUser({ id: socket.id, ...options }) // ... spread syntax to break it into username and room

        if (error) { //if error then just return that and chat.js (client)will then sent it to the user
            return callback(error)
        }

        socket.join(user.room) //join to subscribe the socket to a given channel(room)

        socket.emit('message', generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined!`))

        callback() //no argument means no errors
    })

    socket.on('sendMessage', (message, callback) => {

        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')//arg is sent as an error,so message will not be emitted by server here and this error message will be shown to the client. 
        }

        io.to(user.room).emit('message', generateMessage(user.username,message))//server is emitting the event to every client connected right now...message that it is recieving from a particular client via socket.on
        callback()//no argument is sent
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => { //run some code when a user(whose socket is there) disconnected..'disconnect'->built in event followed by a listener same as connection in io.on
        const user = removeUser(socket.id)

        if(user){ // if not undefined
            io.to(user.room).emit('message',  generateMessage('Admin',`${user.username} has left!`)) //no need to use broadcast as current user has already been disconnected.
            //'to' is used to notified user only in that room
        }
           
    })
})


server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
