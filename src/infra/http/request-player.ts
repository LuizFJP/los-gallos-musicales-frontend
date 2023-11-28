import { Player } from "../../domain/entities/room/room";

export const savePlayer = async (player: Player) => {
  await fetch("http://localhost:8100/player/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  });
}

export const reportPlayer = async (roomName: string, playerName: string) => {
  await fetch("http://localhost:8100/player/report", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify( {
      roomName, 
      username: playerName
    }),
  });
}