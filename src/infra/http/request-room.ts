import { Room, Player } from '../../domain/entities/room/room';

export const loadRooms = async () => {
  try {
    const data = await fetch("http://localhost:8100/room/all");
    const { rooms } = await data.json();
    return rooms;
  } catch (error) {
    console.log(error);
  }
};

export const createRoom = async (room: Room) => {
  await fetch("http://localhost:8100/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ room }),
  });
};

export const joinRoom = async (playerInfo: Player,name: string) => {
  try {
    const res = await fetch(`http://localhost:8100/room/join?name=${name}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerInfo)
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};
