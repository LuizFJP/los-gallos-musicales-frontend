export type Player = {
  userName?: string;
  penalties?: number;
  score?: number;
  wins?: number;
  img?: string; 
}

export type Room = {
  name?: string;
  canvas?: string; 
  players?: Player[];
  genreId?: string;
  round?: number,
  maxPlayers?: number,
  currentPlayers?:number,
  playlistId?: string,
  roundDuration?:number,
  roundInterval?:number
}