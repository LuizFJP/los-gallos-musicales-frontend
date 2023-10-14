import { io, Socket } from 'socket.io-client';

export function startSocket(name: string): Socket {
  const socket = io("ws://localhost:3000", {
    transports: ['websocket'],
    upgrade: false,
    query: {
      name,
    }}); 
    
    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);

      })
    
    return socket;
}
