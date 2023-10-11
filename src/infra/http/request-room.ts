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
  try {
    await fetch("http://localhost:8100/room/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ room }),
  });
  }
  catch(error) {
    console.log(error);
  }
  
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
    const a = await res.json();
    console.log(a);
    return a;
  } catch (error) {
    console.log(error);
  }
};
