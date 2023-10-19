import { FC, useMemo, useState,  } from "react";
import { useEffect } from "react";
import Canvas from "../../components/canvas/canvas";
import { useLocation } from "react-router-dom";
import { getRoom, joinRoom } from "../../../infra/http/request-room";
import { Player, Room } from "../../../domain/entities/room/room";
import { PlayerList } from "../../components/lists/player-list/player-list";
import { Chat } from "../../components/chat/chat";
import { startSocket } from "../../../infra/websocket/websocket";

import "./room.scss";

const Room: FC = () => {
  const [room, setRoom] = useState<Room>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [socket, setSocket] = useState<any>(null);

  const location = useLocation();
  const {created, username} = location.state as {created: boolean, username: string};

  function useQuery(): any {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
  }

  const query = useQuery();
  const name = query.get("name");

  useEffect(() => {
    setSocket(startSocket(name));
    
    return () => {
      socket.emit('leave-room', name, username);
      socket?.disconnect();
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("update-players", (room: any) => {
        setPlayers((prevState) => [...prevState, room.players]);        
      });
      
      if(!created) {
        joinRoom({
          username,
          penalties: 0,
          score: 0,
          wins: 0,
          avatar: 'rioso',
          artist: false,
        }, name).then((res) => {
          setRoom(res);
          setPlayers(res.players);
        });
  
        socket.emit('update-players', name, {
          username,
          penalties: 0,
          score: 0,
          wins: 0,
          avatar: 'rioso',
          artist: false,
        });
      } else {
        getRoom(name).then((res) => {
          console.log(res)
          setRoom(res);
          setPlayers(res.players);
        });
      }

    }

  }, [socket]);



  return (
    <main className="container mx-auto flex p-16">
      <PlayerList players={players} />
      <div className="content-container">
        {socket && (<Canvas
        socket={socket}
          room={room}
          roomName={name as string}
        />)}
        {socket && <Chat socket={socket} />}
      </div>
    </main>
  );
};

export default Room;
