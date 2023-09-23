export const loadRooms = async () => {
  try {
    const data = await fetch("http://localhost:8100/room/all");
    const { rooms } = await data.json();
    return rooms;
  } catch (error) {
    console.log(error);
  }
};

export const createRoom = async (room) => {
  await fetch("http://localhost:8100/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ room }),
  });
}
