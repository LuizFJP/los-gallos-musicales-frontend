import { Song } from "../playlist/playlist";

export type Player = {
  username?: string | null;
  penalties?: number;
  score?: number;
  wins?: number;
  avatar?: string;
  artist?: boolean;
}

export type Room = {
  name?: string;
  canvas?: string;
  players?: Player[];
  genre?: string;
  round?: number,
  maxPlayers?: number,
  currentPlayers?: number,
  listSongs?: Song[],
  song?: Song,
  roundDuration?: string,
  roundInterval?: string,
  breakMatch?: boolean,
}
