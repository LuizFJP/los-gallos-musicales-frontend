import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { io, Socket } from 'socket.io-client';
import { Player } from '../../domain/entities/room/room';

export function startSocket(name: string, setSocketConnnected: Dispatch<SetStateAction<boolean>>): Socket {
  const socket = io("ws://localhost:8100", {
    transports: ['websocket'],
    upgrade: false,
    query: {
      name,
    }
  });
  socket.on('connect', () => {
    console.log('WebSocket connected');
    setSocketConnnected(true);
  });

  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  return socket;
}
