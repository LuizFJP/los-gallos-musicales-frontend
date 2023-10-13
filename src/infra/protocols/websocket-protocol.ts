export interface WebSocketProtocol {
  connect(): void;
  disconnect(): void;
  emitData(dataName: string, roomName: string, data: any): void;
  onDraw(name: string, callback: any): void;
}