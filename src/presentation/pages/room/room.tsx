import { FC, useRef, useState } from "react";
import { useEffect } from "react";
import Canvas from "../../components/canvas/canvas";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
  const socket = useRef<any>();

  const location = useLocation();
  const { created, username } = location.state as { created: boolean, username: string };
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") as string;
  const navigate = useNavigate();

  useEffect(() => {
    socket.current = startSocket(name);
    // window.addEventListener('beforeunload', handleBeforeUnload);

    if (!username) {
      navigate('/');
    }
    if (!created) {
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
      socket.current.emit('leave-room', name, username);
      socket.current.disconnect();
      // window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);

  useEffect(() => {
    // window.addEventListener('beforeunload', handleBeforeUnload);

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
        {socket.current && <Chat socket={socket.current} username={username as string} />}
      </div>
    </main>
  );
};

export default Room;
