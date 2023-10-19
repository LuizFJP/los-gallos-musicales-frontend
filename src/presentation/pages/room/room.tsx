import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import Canvas from "../../components/canvas/canvas";
import { useBeforeUnload, useLocation } from "react-router-dom";
import { getRoom, joinRoom } from "../../../infra/http/request-room";
import { Player, Room } from "../../../domain/entities/room/room";
import { PlayerList } from "../../components/lists/player-list/player-list";
import { Chat } from "../../components/chat/chat";
import { startSocket } from "../../../infra/websocket/websocket";

import "./room.scss";

const Room: React.FC = () => {
  const [room, setRoom] = useState<Room>();
  const [players, setPlayers] = useState<Player[]>([]);
  const socket = useRef<any>();

  const location = useLocation();
  const {created, username} = location.state as {created: boolean, username: string};

  function useQuery(): any {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const query = useQuery();
  const name = query.get("name");

  useEffect(() => {
    socket.current = startSocket(name);

    if(!created) {
      joinRoom({
        username,
        penalties: 0,
        score: 0,
        wins: 0,
        avatar: 'rioso',
        artist: false,
      }, name).then((room) => {
        setRoom(room);
        setPlayers(room.players);
      });
    } else {
      getRoom(name).then((room) => {
        setRoom(room);
        setPlayers(room.players);
      });
    }
    
    const updatePlayers = () => {
      socket.current.emit('update-players', name);
    }

    updatePlayers()
    return () => {
      console.log(socket)
      socket.current.emit('leave-room', name, username);
      socket.current.disconnect();
    }
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.connect();
      socket.current.on("update-players", (room: any) => {
        setPlayers(room.players);        
      });
    }

  }, [socket.current]);



  return (
    <main className="container mx-auto flex p-16">
      <PlayerList players={players} />
      <div className="content-container">
        {socket && (<Canvas
        socket={socket.current}
          room={room}
          roomName={name as string}
        />)}
        {socket.current && <Chat socket={socket.current} />}
      </div>
    </main>
  );
};

export default Room;
