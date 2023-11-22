import { Room, Player } from "../../domain/entities/room/room";

export const loadRooms = async () => {
  try {
    const data = await fetch("http://localhost:8100/room/all");
    const { rooms } = await data.json();
    return rooms;
  } catch (error) {
    console.log(error);
  }
};

export const getRoom = async (roomName: string) => {
  try {
    const data = await fetch(`http://localhost:8100/room/?name=${roomName}`);
    const { room } = await data.json();
    return room;
  } catch (error) {
    console.log(error);
  }
};

export const createRoom = async (room: Room) => {
  try {
    const request = await fetch("http://localhost:8100/room/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room }),
    });
    return await request.json();
  } catch (error) {
    console.log(error);
  }
};

export const joinRoom = async (playerInfo: Player, name: string) => {
  try {
    const res = await fetch(`http://localhost:8100/room/join?name=${name}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerInfo),
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const checkRoomIsFull = async (roomName: string) => {
  try {
    const res = await fetch(
      `http://localhost:8100/room/check-full?name=${roomName}`
    );
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const createRoomShortLink = async (roomName: string) => {
  try {
    const res = await fetch(
      `http://localhost:8100/room/share?name=${roomName}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const getRoomByShortLink = async (shortLink: string) => {
  try {
    const res = await fetch(
      `http://localhost:8100/room/share?shortId=${shortLink}`
    );
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};
