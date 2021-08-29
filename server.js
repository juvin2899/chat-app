const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const formatMessage = require("./utils/messages.js");
const {
  userJoin,
  getCurrentUser,
  getRoomUsers,
  userLeave,
} = require("./utils/users.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(__dirname + "/public"));

//run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    //if(!username || !room)

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // welcome message to current user
    socket.emit("message", formatMessage("Welcome to Chat app"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(`${user.username} has joined the chat`));

    //Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //listen for "chatMessage"
  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(message, user.username));
  });

  // When client disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(`${user.username} has left the chat`)
      );
      //Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server runnning on port ${PORT}`));
