import { FC, useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import {
  useBeforeUnload,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Canvas from "../../components/canvas/canvas";
import {
  createRoomShortLink,
  getRoom,
  joinRoom,
} from "../../../infra/http/request-room";
import { Player, Room as RoomEntity } from "../../../domain/entities/room/room";
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
import { FeedBackButton } from "../../components/feedback-button/feedback-button";
import { RoomShareButton } from "../../components/button/share/room-share-button";
import { ShareModal } from "../../components/modal/share-modal/share-modal";
import { MdClose, MdOutlineReport } from "react-icons/md";
import { GiExitDoor } from "react-icons/gi";
import ActionModal from "../../components/modal/action-modal/action-modal";
import { reportPlayer } from "../../../infra/http/request-player";

const Room: FC = () => {
  const {
    room,
    players,
    breakMatch,
    artist,
    song,
    tip,
    setRoom,
    setPlayers,
    setBreakMatch,
    setArtist,
    setSong,
    setTip,
  } = useRoom();
  const [timer, setTimer] = useState<number>(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const [songName, setSongName] = useState<string>();
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shortRoomId, setShortRoomId] = useState<string>("");
  const socket = useRef<any>();
  const location = useLocation();
  const { created, username, userImage } = location.state as {
    created: boolean;
    username: string;
    userImage: string;
  };
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") as string;
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  const handleShareModalOpen = () => {
    setIsShareModalOpen(!isShareModalOpen);
  };

  const updatePlayers = () => {
    socket.current.emit('update-players', name, song);
  }

  const initStates = (room: Room) => {
    setRoom(room);
    setTimer((parseInt(room.roundDuration as string) as number) * 60);
    setBreakMatch(room.breakMatch as boolean);
    setPlayers(room.players as Player[]);
    setArtist(
      room.players?.find((player: Player) => player.username === username)
        ?.artist as boolean
    );
    setSong(room.song as SongDTO);
    setSongName(room.song?.name);
    setTip({
      tips: room.tip?.tips as string[],
      numberOfTips: room.tip?.numberOfTips as number,
      tipOn: room.tip?.tipOn as boolean,
    });
  };

  useEffect(() => {
    if (!username) {
      navigate("/");
    }

    socket.current = startSocket(name, setSocketConnected);

    getRoom(name).then((room) => {
      initStates(room);

      if (!created) {
        joinRoom(
          {
            username,
            penalties: 0,
            score: 0,
            wins: 0,
            avatar:
              "https://raw.githubusercontent.com/LuizFJP/los-gallos-musicales-frontend/master/src/assets/avatars/avatar_01.png",
            artist: room?.players?.length === 0,
          },
          name
        ).then((room) => {
          updatePlayers();
          initStates(room);
        });
      }
    });

    createRoomShortLink(name).then((roomShortLink: string) => {
      setShortRoomId(roomShortLink);
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
        setArtist(
          room.players.find((player: Player) => player.username === username)
            ?.artist
        );
      });

      socket.current.on("cronometer", (time: number, breakMatch: boolean) => {
        setTimer(time);
        setBreakMatch(breakMatch);
      });

      socket.current.on("update-song", (song: SongDTO) => {
        setSong(song);
        setSongName(song?.name);
      });

      socket.current.on(
        "tip",
        (tips: string[], numberOfTips: number, tipOn: boolean) => {
          setTip({ tips, numberOfTips, tipOn });
        }
      );

      if (created) socket.current.emit("cronometer", room);
    }
  }, [socket.current?.connected, room?.name]);

  useBeforeUnload(
    useCallback(() => {
      socket.current.emit("leave-room", name, username);
      socket.current.disconnect();
      setSocketConnected(false);
    }, [])
  );

  const handleReportPlayer = async () => {
    await reportPlayer(name, username as string).then((res) => console.log(res));
  }

  return (
    <main className="container mx-auto flex p-16 xl:px-4 xl:py-12">
      <PlayerList players={players as Player[]} />
      {!breakMatch && song && socket.current && (
        <Tip
          artist={artist as boolean}
          song={song as SongDTO}
          socket={socket.current}
          tip={tip as TipType}
        />
      )}
      <div className="content-container relative">
        {isLeaving && (
          <ActionModal onConfirm={() => navigate("/")} onCancel={() => setIsLeaving(false)} hasCancel={true} confirmText="Sair" cancelText="Cancelar" title="Sair da sala" description="Tem certeza que deseja sair da sala?" isOpen={isLeaving} icon={GiExitDoor} iconColor="#000"/>
        )}
        {isShareModalOpen && shortRoomId && (
          <ShareModal
            shortLink={`http://localhost:5173/share/${shortRoomId}`}
            isOpen={isShareModalOpen}
            onClose={handleShareModalOpen}
          />
        )}
        {!breakMatch && artist != undefined ? (
          socketConnected && (
            <Canvas socket={socket.current} roomName={name as string} />
          )
        ) : (
          <BreakMatch previousSongName={songName} />
        )}
        <div className="absolute -top-10 flex items-center justify-between action-room-container">
          <FeedBackButton />
          <div className="flex flex-row w-96 items-center justify-end gap-3">
          <RoomShareButton clickAction={handleShareModalOpen} />
          {!artist && (<MdOutlineReport size={40} color={"#fff"} className="hover:cursor-pointer" onClick={handleReportPlayer} />)}
          <MdClose size={40} onClick={() => setIsLeaving(true)} color={"#fff"} className="hover:cursor-pointer" />
          </div>
        </div>
        {artist && <MusicPlayer song={song as SongDTO} />}
        <div className="progress-bar-container">
          <ProgressBarComponent timer={timer} room={room as RoomEntity} />
        </div>
        {socket.current && songName && (
          <Chat
            socket={socket.current}
            username={username as string}
            songName={songName as string}
          />
        )}
      </div>
    </main>
  );
};

export default Room;
