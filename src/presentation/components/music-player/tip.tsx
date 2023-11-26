import { SongDTO } from "../../../domain/entities/playlist/song";
import { Socket } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import { Tip } from "../../../domain/entities/room/tip";

interface MusicPlayerProps {
  socket: Socket;
  artist: boolean;
  song: SongDTO;
  tip: Tip;
}

export function Tip({ socket, artist, song, tip }: MusicPlayerProps) {
  const [searchParams] = useSearchParams();
  const roomName = searchParams.get("name");

  const generateTip = () => {
    if (tip.numberOfTips as number > 0) {
      let randomIndex = 0;
      while (tip.tips[randomIndex] === '_') {
        randomIndex = Math.round(Math.random() * song.name.length);
        tip.tips[randomIndex] = song.name[randomIndex];
      };
      socket.emit("tip", roomName, tip.tips, true);
    }
  }

  return (
    <div>
      {artist && <button onClick={generateTip}>Dica</button>}
      {tip.tipOn && <div>
        {tip.tips.map((letter, index) => {
          return (
            <span key={index}>{letter}</span>
          )
        })}
      </div>}
    </div>
  );
}