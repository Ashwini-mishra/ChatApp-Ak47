const express = require('express');
const app = express();
require('dotenv').config()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const formatMessage = require("./util/message");
const { userJoin , getCurrentUser, userLeave, getRoomUsers} = require("./util/user");


const port =process.env.PORT;

app.use(express.static('public'))

io.on('connection', (socket) => {

    socket.on('joinRoom' , ({userName ,room})=>{
        const user = userJoin(socket.id , userName , room);
       
        socket.join(user.room);

    // welcome message to current user
        socket.emit('message' , formatMessage(`${user.userName}`, " welcome to the chat with AK-47")); 

        // broadcast when a user connects
        socket.broadcast.to(user.room).emit('message',
          formatMessage("Server", `${user.userName} has joined the chat`)
        );


      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });


  // Listen for chatMessage
  socket.on('chat message', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.userName, msg));
  });


 // Runs when client disconnects
 socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit('message',
        formatMessage('Server', `${user.userName} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
  });


server.listen(port , ()=>{console.log(`server is running on port ${port}`)});