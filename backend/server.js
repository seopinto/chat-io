const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let connectedUsers = {};

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
      socket.emit("yourUserId", socket.id); // Envía el ID del socket al cliente


  socket.on("setAlias", (alias) => {
        connectedUsers[socket.id] = { userId: socket.id, alias };
    io.emit(
      "usersList",
      Object.values(connectedUsers).map((user) => ({
        id: user.userId,
        alias: user.alias,
      }))
    );
  });

  socket.on("joinRoom", ({ roomId, userId }) => {
    if (!roomId || !userId) {
      console.error("roomId or userId is undefined", { roomId, userId });
      return;
    }
    socket.join(roomId);
    console.log(`User ${userId} joined chat ${roomId}`);
  });

  socket.on('sendMessage', ({ roomId, senderId, text, timestamp }, callback) => {
    const alias = connectedUsers[senderId]?.alias || 'Unknown';
    
    const message = {
        roomId,
        senderId,
        alias,
        text,
        timestamp,
    };
  
    // Emitir el mensaje a todos en la sala, incluido el remitente
    io.in(roomId).emit('newMessage', message);
    console.log('Mensaje enviado:', message);

    // Confirma la recepción al cliente
    if (typeof callback === 'function') {
        callback('Mensaje recibido');
    }
});

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    delete connectedUsers[socket.id];
    io.emit(
      "usersList",
      Object.values(connectedUsers).map((user) => ({
        id: user.userId,
        alias: user.alias,
      }))
    );
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
