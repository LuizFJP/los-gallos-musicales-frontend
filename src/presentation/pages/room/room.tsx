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
import { MusicPlayer } from "../../components/music-player/music-player";
import { Tip as TipType } from "../../../domain/entities/room/tip";
import { Tip } from "../../components/music-player/tip";
import { useRoom } from "../../hooks/use-room";

const Room: FC = () => {
  const { room, players, breakMatch, artist, song, tip, setRoom, setPlayers, setBreakMatch, setArtist, setSong, setTip } = useRoom();
  const [timer, setTimer] = useState<number>(0);
  const [socketConnected, setSocketConnected] = useState(false);
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
    console.log(room)
    setRoom(room);
    setTimer(parseInt(room.roundDuration as string) as number * 60);
    setBreakMatch(room.breakMatch as boolean);
    setPlayers(room.players as Player[]);
    setArtist(room.players?.find((player: Player) => player.username === username)?.artist as boolean);
    setSong(room.song as SongDTO);
    setSongName(room.song?.name);
    setTip({ tips: room.tip?.tips as string[], numberOfTips: room.tip?.numberOfTips as number, tipOn: room.tip?.tipOn as boolean })
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
        setRoom(room);
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

      socket.current.on("tip", (tips: string[], numberOfTips: number, tipOn: boolean) => {
        setTip({ tips, numberOfTips, tipOn });
      });

      if (created) socket.current.emit('cronometer', room);
    }
  }, [socket.current?.connected, room?.name]);

  return (
    <main className="container mx-auto flex p-16">
      <PlayerList players={players as Player[]} />
      {!breakMatch && song && socket.current && <Tip artist={artist as boolean} song={song as SongDTO} socket={socket.current} tip={tip as TipType} />}
      <div className="content-container">
        {!breakMatch && artist != undefined
          ? socketConnected && <Canvas
            socket={socket.current}
            roomName={name as string}
          />
          : <BreakMatch />}
        {artist && <MusicPlayer song={song as SongDTO} />}
        <ProgressBarComponent timer={timer} room={room as Room} />
        {socket.current && songName && <Chat socket={socket.current} username={username as string} songName={songName as string} />}
      </div>
    </main>
  );
};

export default Room;
