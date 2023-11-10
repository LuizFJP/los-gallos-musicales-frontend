import { SongDTO } from "../../../domain/entities/playlist/song";

interface MusicPlayerProps {
  song: SongDTO;
}

export const MusicPlayer = ({song}: MusicPlayerProps) => {
  return (
    <div className="music-player">
      <p>{song.name}</p>
      <iframe hidden allow="autoplay" src={`https://www.youtube.com/embed/${song.videoId}?autoplay=1`} ></iframe>
    </div>
  );
}