export interface WebSocketProtocol {
  connect(): void;
  disconnect(): void;
  emitData(dataName: string, data: any): void;
  on(name: string, callback: any): void;
}