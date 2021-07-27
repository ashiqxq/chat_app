const path = require('path')
const http = require('http')
const express = require('express');
const socketio = require('socket.io')
const Filter = require('bad-words');
const app = express()
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


let welcome_message = 'welcome1'
let new_user_message = ' has joined'
let user_left_message = ' has left the chat'
io.on('connection', (socket)=>{
    console.log("New websocket connection work");

    socket.on('join', ({username, room}, callback)=>{
        const {error, user} = addUser({
            id: socket.id,
            username,
            room
        })
        if (error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('Admin', welcome_message));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', user.username+new_user_message));
        callback()
    })
    socket.on('sendMessage', (message, callback)=>{
        const user = getUser(socket.id);
        const filter = new Filter();
        if (filter.isProfane(message)){
            return callback('Profanity detected')
        }
        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback('Delivered');
    })
    socket.on('sendLocation', (message, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, message));
        callback();
    })
    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if (user){
            io.to(user.room).emit('message', generateMessage('Admin', user.username+user_left_message));
        }
        
    })
})


server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`);
});

