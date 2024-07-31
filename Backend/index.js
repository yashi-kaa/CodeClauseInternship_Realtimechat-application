const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { addUser, removeUser, getUser, getRoomUsers } = require("./entity");

// Instances
const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

// Endpoint to verify API is working
app.get("/", (req, res) => {
  res.json("API is working");
});

// Socket.IO event handling
io.on("connect", (socket) => {
  // Join event: when a user joins a room
  socket.on("join", ({ user, room }, callback) => {
    console.log(user, room);

    // Add user to the room
    const { response, error } = addUser({
      id: socket.id,
      user: user,
      room: room,
    });

    if (error) {
      callback(error);
      return;
    }

    // Join the socket to the room
    socket.join(response.room);

    // Emit a welcome message to the user who joined
    socket.emit("message", {
      user: "admin",
      text: `Welcome ${response.user}`,
    });

    // Broadcast to all clients in the room that a new user has joined
    socket.broadcast.to(response.room).emit("message", {
      user: "admin",
      text: `${response.user} has joined`,
    });

    // Send updated room members list to all clients in the room
    io.to(response.room).emit("roomMembers", getRoomUsers(response.room));
  });


  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    if (!user) {
      callback("User not found");
      return;
    }


    io.to(user.room).emit("message", { user: user.user, text: message });

    callback();
  });

  
  socket.on("disconnect", () => {
    console.log("User disconnected");

    const user = removeUser(socket.id);

    if (user) {
 
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.user} has left`,
      });

     
      io.to(user.room).emit("roomMembers", getRoomUsers(user.room));
    }
  });
});


const PORT = 7000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
