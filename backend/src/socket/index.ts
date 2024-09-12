import { Server, Socket } from "socket.io";
import { Logger } from "../logger";

export class SocketManager {
  private _socket: Socket;
  private _io: Server;
  private _logger: Logger;

  constructor(socket: Socket, io: Server) {
    this._io = io;
    this._logger = new Logger();
    this._socket = socket;
  }

  public onReceiveMessage() {
    this._socket.on(
      "send-message",
      ({ message, roomId }: { message: any; roomId: string }) => {
        this._socket.broadcast
          .to(`room-${roomId}`)
          .emit("send-message", message);
      }
    );
  }

  public onJoinRoom() {
    this._socket.on("join-chat", (roomId: string, userId: string) => {
      this._socket.join(`room-${roomId}`);
      this._io.to(`room-${roomId}`).emit("user-joined", userId);
    });
  }

  public onAdminJoinRoom() {
    this._socket.on("join-chat-admin", (roomId: string) => {
      this._logger.log(`Admin join to a room ${roomId}`);
      this._socket.join(`room-admin-${roomId}`);
    });
  }

  public onRequestIsAdminOnline() {
    this._socket.on(
      "request-is-admin-online",
      (roomId: string, userId: string) => {
        this._logger.log(`User ${userId} is looking for admin status`);
        this._socket.join(userId);
        this._io.to(`room-admin-${roomId}`).emit(`verify-admin-online`, userId);
      }
    );
  }

  public onGetConfirmationAdminOnline() {
    this._socket.on("confirmation-admin-online", (roomId: string, userId) => {
      this._logger.success(`Admin of Room ${roomId} is online`);
      this._io.to(userId).emit("admin-online", roomId);
    });
  }

  public onAdminAcceptRequest() {
    this._socket.on("request-accepted", (data: any, newUserId: string) => {
      this._io.to(newUserId).emit("request-accepted", data, newUserId);
    });
  }

  public onRequestToJoin() {
    this._socket.on("request-to-join", (roomId: string, userId: string) => {
      this._socket.join(userId);
      this._logger.log(`User ${userId} request to joins ${roomId}`);
      this._io
        .to(`room-admin-${roomId}`)
        .emit("request-to-join", { roomId, userId });
    });
  }
}
