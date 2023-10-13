import React, { useState } from "react";
import { useEffect, useRef } from "react";
import Canvas from "../../components/canvas/canvas";
import { useParams } from "react-router-dom";
import { joinRoom } from "../../../infra/http/request-room";
import { Player, Room } from "../../../domain/entities/room/room";
import { PlayerList } from "../../components/lists/player-list/player-list";
import { Chat } from "../../components/chat/chat";
import { socket } from "../../../infra/websocket/websocket";

const Room: React.FC = () => {
  const { name } = useParams();
  const [room, setRoom] = useState<Room>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [username, setUsername] = useState<string>("teste"); 
  useEffect(() => {
    joinRoom({
      username,
      penalties: 0,
      score: 0,
      wins: 0,
      avatar: 'rioso',
      artist: false,
    }, name as string).then((res) => {
      setRoom(res);
    });
    socket.emit('update-players', name as string, {
        username,
        penalties: 0,
        score: 0,
        wins: 0,
        avatar: 'rioso',
        artist: false,
      });

    return () => {
        socket.emit('leave-room', name as string, username);
        socket.disconnect()
      }
      
  }, []);


  socket.on("join-room", (room: any) => {
    setPlayers(room.players);
  })

  return (
    <main className="container mx-auto flex p-16">
      <PlayerList players={players} />
      <div className="flex flex-col mx-auto gap-2">
        {room && (<Canvas
          room={room}
          roomName={name as string}
        />)}
        <Chat />
      </div>
    </main>
  );
};

export default Room;
