import { Player } from "../../domain/entities/Room";

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