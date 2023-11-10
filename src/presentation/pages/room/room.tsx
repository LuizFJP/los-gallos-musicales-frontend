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
import { ProgressBarComponent } from "../../components/progress-bar/progress-bar";
import { BreakMatch } from "../../components/break-match/break-match";
import { SongDTO } from "../../../domain/entities/playlist/song";
import { random, set } from "lodash";
import { MusicPlayer } from "../../components/music-player/music-player";

const Room: FC = () => {
  const [room, setRoom] = useState<Room>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [breakMatch, setBreakMatch] = useState<boolean>(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [playerName, setPlayerName] = useState<string>();
  const [artist, setArtist] = useState<boolean>();
  const [song, setSong] = useState<SongDTO>();
  const [songName, setSongName] = useState<string>();
  const socket = useRef<any>();

  const location = useLocation();
  const { created, username } = location.state as {
    created: boolean;
    username: string;
  };
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") as string;
  const navigate = useNavigate();

  const updatePlayers = () => {
    socket.current.emit('update-players', name, song);
  }

  const initStates = (room: Room) => {
    setRoom(room);
    setTimer(parseInt(room.roundDuration as string) as number * 60);
    setBreakMatch(room.breakMatch as boolean);
    setPlayers(room.players as Player[]);
    setArtist(room.players?.find((player: Player) => player.username === username)?.artist);
    setSong(room.song);
    setSongName(room.song?.name);
  }


  useEffect(() => {
    if (!username) {
      navigate('/');
    }
   
    socket.current = startSocket(name, setSocketConnected);

    getRoom(name).then((room) => {
      initStates(room);

      if (!created) {
        joinRoom({
          username,
          penalties: 0,
          score: 0,
          wins: 0,
          avatar: 'rioso',
          artist: room?.players?.length === 0,
        }, name)
          .then((room) => {
            updatePlayers();
            initStates(room);
          });
      }
    });

    return () => {
      socket.current.emit("leave-room", name, username);
      socket.current.disconnect();
      setSocketConnected(false);
    };
  }, []);

  useEffect(() => {
    if (socket.current?.connected && room?.name) {
      socket.current.on("update-players", (room: any) => {
        console.log(room)
        setPlayers(room.players);
        setArtist(room.players.find((player: Player) => player.username === username)?.artist);
      });

      socket.current.on('cronometer', (time: number, breakMatch: boolean) => {
        setTimer(time);
        setBreakMatch(breakMatch);
      });

      socket.current.on('update-song', (song: SongDTO) => {
        setSong(song);
        setSongName(song?.name);
      });

      if (created) socket.current.emit('cronometer', room);
    }
  }, [socket.current?.connected, room?.name]);

  return (
    <main className="container mx-auto flex p-16">
      <PlayerList players={players} />
      <div className="content-container">
        {!breakMatch && artist != undefined
          ? socketConnected && <Canvas
            artist={artist as boolean}
            socket={socket.current}
            room={room}
            roomName={name as string}
          />
          : <BreakMatch />}
          {artist && <MusicPlayer song={song as SongDTO}/>}
        <ProgressBarComponent timer={timer} room={room as Room} />
        {socket.current && songName && <Chat socket={socket.current} username={playerName as string} songName={songName as string} />}
      </div>
    </main>
  );
};

export default Room;
