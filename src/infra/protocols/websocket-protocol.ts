export interface WebSocketProtocol {
  connect(): void;
  disconnect(): void;
  emitData(dataName: string, data: any): void;
  onDraw(name: string, callback: any): void;
}