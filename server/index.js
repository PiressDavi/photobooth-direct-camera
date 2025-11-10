import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // permite o frontend acessar de qualquer domínio
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("QR Photobooth WebSocket está online!");
});

io.on("connection", (socket) => {
  console.log("Novo cliente conectado!");

  socket.on("photo", (data) => {
    // retransmite a foto para todos os admins conectados
    io.emit("photo", data);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado.");
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
