import React, { useState } from "react";
import { useEffect } from "react";
import Canvas from "../../components/canvas/canvas";
import { useLocation } from "react-router-dom";
import { joinRoom } from "../../../infra/http/request-room";
import { Player, Room } from "../../../domain/entities/room/room";
import { PlayerList } from "../../components/lists/player-list/player-list";
import { Chat } from "../../components/chat/chat";
import { socket } from "../../../infra/websocket/websocket";

import "./room.scss";

const Room: React.FC = () => {
  const [room, setRoom] = useState<Room>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [username, setUsername] = useState<string>("teste"); 

  function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const query = useQuery();
  const name = query.get('name');

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
        socket.disconnect();
      }
      
  }, []);


  socket.on("join-room", (room: any) => {
    setPlayers(room.players);
  })

  return (
    <main className="container mx-auto flex p-16">
      <PlayerList players={players} />
      <div className="content-container">
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
