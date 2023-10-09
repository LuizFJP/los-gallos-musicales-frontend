import { ListSongs } from "../playlist/playlist";

export type Player = {
  userName?: string;
  penalties?: number;
  score?: number;
  wins?: number;
  avatar?: string;
}

export type Room = {
  name?: string;
  canvas?: string;
  players?: Player[];
  genre?: string;
  round?: number,
  maxPlayers?: number,
  currentPlayers?: number,
  listSongs?: ListSongs[],
  roundDuration?: number,
  roundInterval?: number
}
