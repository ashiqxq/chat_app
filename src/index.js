const path = require('path')
const http = require('http')
const express = require('express');
const socketio = require('socket.io')
const Filter = require('bad-words');
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


let welcome_message = 'welcome1'
let new_user_message = 'New user has joined'
let user_left_message = 'An user has left the chat'
io.on('connection', (socket)=>{
    console.log("New websocket connection work");
    socket.emit('message', welcome_message);
    socket.broadcast.emit('message', new_user_message);

    socket.on('sendMessage', (message, callback)=>{
        const filter = new Filter();
        if (filter.isProfane(message)){
            return callback('Profanity detected')
        }
        io.emit('message', message);
        callback('Delivered');
    })
    socket.on('sendLocation', (message, callback)=>{
        socket.broadcast.emit('message', message);
        callback();
    })
    socket.on('disconnect', ()=>{
        io.emit('message', user_left_message);
    })
})


server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`);
});

