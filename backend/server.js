const express = require('express');
const app = express();

const server = require("http").createServer(app);
const {Server} = require("socket.io")

const io = new Server(server);

app.get("/",(req,res)=>{
    res.send("This is mern app..");
});

io.on("connection", (socket)=>{
    console.log("user connceted");
})
const port = process.env.PORT || 5000;
server.listen(port, ()=>{
    console.log("server is listening here...")
})
