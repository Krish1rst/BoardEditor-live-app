const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { PeerServer } = require("peer");

const { addUser, getUser, removeUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const peerServer = PeerServer({
  port: 9000, 
  path: "/peerjs", 
});


app.use("/peerjs", (req, res, next) => {
  next(); 
});

app.get("/", (req, res) => {
  res.send(
    "This is the official server for the real-time board sharing app by krishna."
  );
});


let roomIdGlobal, imgURLGlobal;


io.on("connection", (socket) => {
  console.log("A user connected with socket ID:", socket.id);

  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId);

    const users = addUser({
      name,
      userId,
      roomId,
      host,
      presenter,
      socketId: socket.id,
    });

    
    socket.emit("userIsJoined", { success: true, users });

    console.log("User joined:", { name, userId });

    
    socket.broadcast.to(roomId).emit("allUsers", users);

    setTimeout(() => {
      socket.broadcast
        .to(roomId)
        .emit("userJoinedMessageBroadcasted", { name, userId, users });
      socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
        imgURL: imgURLGlobal,
      });
    }, 1000);
  });

  socket.on("whiteboardData", (data) => {
    imgURLGlobal = data;
    socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
      imgURL: data,
    });
  });

  socket.on("message", (data) => {
    const { message } = data;
    const user = getUser(socket.id);
    if (user) {
      socket.broadcast
        .to(roomIdGlobal)
        .emit("messageResponse", { message, name: user.name });
    }
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      socket.broadcast.to(roomIdGlobal).emit("userLeftMessageBroadcasted", {
        name: user.name,
        userId: user.userId,
      });
    }
    console.log("User disconnected:", socket.id);
  });
});


const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
