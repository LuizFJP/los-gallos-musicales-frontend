import { io, Socket } from 'socket.io-client';

const socket: Socket = io("ws://localhost:8100"); // Initialize the WebSocket connection

socket.on('connect', () => {
  console.log('WebSocket connected');
});

export { socket };
