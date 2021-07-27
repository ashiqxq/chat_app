const path = require('path')
const http = require('http')
const express = require('express');
const socketio = require('socket.io')
const Filter = require('bad-words');
const app = express()
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


let welcome_message = 'welcome1'
let new_user_message = ' has joined'
let user_left_message = 'An user has left the chat'
io.on('connection', (socket)=>{
    console.log("New websocket connection work");

    socket.on('join', ({username, room})=>{
        socket.join(room)
        socket.emit('message', generateMessage(welcome_message));
        socket.broadcast.to(room).emit('message', generateMessage(username+new_user_message));
    })
    socket.on('sendMessage', (message, callback)=>{
        const filter = new Filter();
        if (filter.isProfane(message)){
            return callback('Profanity detected')
        }
        io.to('thunder').emit('message', generateMessage(message));
        callback('Delivered');
    })
    socket.on('sendLocation', (message, callback)=>{
        io.emit('locationMessage', generateLocationMessage(message));
        callback();
    })
    socket.on('disconnect', ()=>{
        io.emit('message', generateMessage(user_left_message));
    })
})


server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`);
});

