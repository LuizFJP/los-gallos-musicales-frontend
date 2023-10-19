import { FC, useMemo, useState,  } from "react";
import { useEffect } from "react";
import Canvas from "../../components/canvas/canvas";
import { useBeforeUnload, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getRoom, joinRoom } from "../../../infra/http/request-room";
import { Player, Room } from "../../../domain/entities/room/room";
import { PlayerList } from "../../components/lists/player-list/player-list";
import { Chat } from "../../components/chat/chat";
import { startSocket } from "../../../infra/websocket/websocket";

import "./room.scss";
import { decryptUsername } from "../../../infra/http/request-security";

const Room: FC = () => {
  const [room, setRoom] = useState<Room>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [socket, setSocket] = useState<any>(null);

  const location = useLocation();
  const {created, username} = location.state as {created: boolean, username: string};  
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user");
  const name = searchParams.get("name") as string;
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState<string>();


  useEffect(() => {
    setSocket(startSocket(name));

    if (!user) {
      console.log(user);
      navigate('/');
    }
    decryptUsername(user as string).then((res) => {
      if (res != undefined) {
        setPlayerName(res);
      }
    })
    return () => {
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
        {socket && <Chat socket={socket} username={playerName as string}/>}
      </div>
    </main>
  );
};

export default Room;
