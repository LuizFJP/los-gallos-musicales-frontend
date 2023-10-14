import React, { useState } from "react";
import { useEffect, useRef } from "react";
import Canvas from "../../components/canvas/canvas";
import { useLocation } from "react-router-dom";
import { joinRoom } from "../../../infra/http/request-room";
import { Player, Room } from "../../../domain/entities/room/room";
import { PlayerList } from "../../components/lists/player-list/player-list";
import { Chat } from "../../components/chat/chat";
import { startSocket } from "../../../infra/websocket/websocket";

const Room: React.FC = () => {
  const [room, setRoom] = useState<Room>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [username, setUsername] = useState<string>("teste");
  const [socket, setSocket] = useState<any>(null);

  function useQuery(): any {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const query = useQuery();
  const name = query.get("name");

  useEffect(() => {  
    setSocket(startSocket(name));
    // socket.connect();

    // socket.on("join-room", (room: any) => {
    //   setPlayers(room.players);
    // });

    // joinRoom({
    //   username,
    //   penalties: 0,
    //   score: 0,
    //   wins: 0,
    //   avatar: 'rioso',
    //   artist: false,
    // }, name).then((res) => {
    //   setRoom(res);
    // });
    // socket.emit('update-players', name, {
    //   username,
    //   penalties: 0,
    //   score: 0,
    //   wins: 0,
    //   avatar: 'rioso',
    //   artist: false,
    // });

    return () => {
      socket?.disconnect();
    }

  }, []);



  return (
    <main className="container mx-auto flex p-16">
      <PlayerList players={players} />
      {/* <div className="flex flex-col mx-auto gap-2">
        {room && (<Canvas
          room={room}
          roomName={name as string}
        />)}
        <Chat />
      </div> */}
    </main>
  );
};

export default Room;
