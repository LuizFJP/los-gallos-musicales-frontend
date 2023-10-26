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
import { ProgressBarComponent } from "../../components/progress-bar/progress-bar";
import { BreakMatch } from "../../components/break-match/break-match";

const Room: FC = () => {
  const [room, setRoom] = useState<Room>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [timer, setTimer] = useState<number>(0)
  const [breakMatch, setBreakMatch] = useState<boolean>(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const socket = useRef<any>();

  const location = useLocation();
  const { created, username } = location.state as { created: boolean, username: string };
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user");
  const name = searchParams.get("name") as string;
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState<string>();
 

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    console.log(event);
    const confirmationMessage = "Quer mesmo sair? Vai perder seus pontos!";
    event.returnValue = confirmationMessage;
    return confirmationMessage;
  }


  useEffect(() => {
    socket.current = startSocket(name, setSocketConnected);

    if (!user) {
      navigate('/');
    }
    decryptUsername(user as string).then((res) => {
      if (res != undefined) {
        setPlayerName(res);
      }
    });
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
        setTimer(parseInt(room.roundDuration as string) as number * 60);
        setBreakMatch(room.breakMatch);
        setPlayers(room.players);
      });
    } else {
      getRoom(name).then((room) => {
        setRoom(room);
        setTimer(parseInt(room.roundDuration as string) as number * 60);
        setBreakMatch(room.breakMatch);
        setPlayers(room.players);
        
      });
    }

    const updatePlayers = () => {
      socket.current.emit('update-players', name);
    }
    updatePlayers();

    return () => {
      socket.current.emit('leave-room', name, username);
      socket.current.disconnect();
      setSocketConnected(false);
    }
  }, []);

  useEffect(() => {
    if (socket.current?.connected && room?.name) {
      socket.current.on("update-players", (room: any) => {
        setPlayers(room.players);
      });
      
      socket.current.on('cronometer', (time: number, breakMatch: boolean) => {
        setTimer(time);
        setBreakMatch(breakMatch);
      })

      if (created) socket.current.emit('cronometer', name, room);
    }
  }, [socket.current?.connected, room?.name]);

  return (
    <main className="container mx-auto flex p-16">
      <PlayerList players={players} />
      <div className="content-container">
        {!breakMatch
         ? socketConnected && <Canvas
         socket={socket.current}
         room={room}
         roomName={name as string}
         />
         : <BreakMatch />}
         <ProgressBarComponent timer={timer} room={room as Room}/>
         {socket.current && <Chat socket={socket.current} username={playerName as string}/>}
      </div>
    </main>
  );
};

export default Room;
