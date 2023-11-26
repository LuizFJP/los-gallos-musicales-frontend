import { Song } from "../playlist/playlist";
import { Tip } from "./tip";

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
  numberOfPlayers?: number,
  listSongs?: Song[],
  song?: Song,
  roundDuration?: string,
  roundInterval?: string,
  breakMatch?: boolean,
  tip?: Tip,
}
