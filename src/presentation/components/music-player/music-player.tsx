import { SongDTO } from "../../../domain/entities/playlist/song";

import "./music-player.scss";

interface MusicPlayerProps {
  song: SongDTO;
}

export const MusicPlayer = ({song}: MusicPlayerProps) => {

  return (
    <div className="music-player absolute text-white font-bold text-lg">
      <p className="song-name-container">Desenhe a música: <strong className="text-amber-500">{song.name}</strong></p>
      <iframe hidden allow="autoplay" src={`https://www.youtube.com/embed/${song.videoId}?autoplay=1`} ></iframe>
    </div>
  );
}
