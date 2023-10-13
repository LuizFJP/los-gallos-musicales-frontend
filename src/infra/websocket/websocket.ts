import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import { WebSocketProtocol } from "../protocols/websocket-protocol";

export class SocketConnection implements WebSocketProtocol{
  private socket: Socket;

  constructor() {
    this.socket = io("ws://localhost:8100");
  }

  emitData(dataName: string, data: any) {
    this.socket.emit(dataName, data);
  }

  connect():void {
    this.socket.connect();
  }

  disconnect():void {
    this.socket.disconnect();
  }

  on(name, callback): void {
    this.socket.on(name, callback);
  }
}