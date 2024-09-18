import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Logger } from "./src/logger";
import { SocketManager } from "./src/socket";

const logger = new Logger();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());

io.on("connection", (socket) => {
  const socketManager = new SocketManager(socket, io);

  socketManager.onReceiveMessage();
  socketManager.onJoinRoom();
  socketManager.onAdminJoinRoom();
  socketManager.onRequestToJoin();
  socketManager.onRequestIsAdminOnline();
  socketManager.onGetConfirmationAdminOnline();
  socketManager.onAdminAcceptRequest();
  socketManager.onNewUserJoin();
  socketManager.onPresenceAllMembersChat();
  socketManager.onLeaveRoom();
});

server.listen(4000, () => {
  console.log("Listen on 4000 port");
});
