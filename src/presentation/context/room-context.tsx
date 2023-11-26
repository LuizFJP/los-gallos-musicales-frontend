import { ReactNode, createContext, useState } from "react";
import { Player, Room } from "../../domain/entities/room/room";
import { Tip as TipType } from "../../domain/entities/room/tip";
import { SongDTO } from "../../domain/entities/playlist/song";

export interface RoomContext extends Room {
  room: Room | undefined;
  artist: boolean | undefined;
  setRoom: (room: Room) => void;
  setPlayers: (players: Player[]) => void;
  setBreakMatch: (breakMatch: boolean) => void;
  setArtist: (artist: boolean) => void;
  setSong: (song: SongDTO) => void;
  setTip: (tip: TipType) => void;
}

export const RoomContext = createContext<RoomContext>({} as RoomContext);

interface RoomProdiverProps {
  children: ReactNode;
}

export function RoomProvider({ children }: RoomProdiverProps) {
  const [room, setRoom] = useState<Room>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [breakMatch, setBreakMatch] = useState<boolean>(false);
  const [artist, setArtist] = useState<boolean>();
  const [song, setSong] = useState<SongDTO>();
  const [tip, setTip] = useState<TipType>();

  return (
    <RoomContext.Provider value={{
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
      setTip
    }} >
      {children}
    </RoomContext.Provider>
  );
}