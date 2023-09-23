export const loadRooms = async () => {
  try {
    const data = await fetch("http://localhost:8100/room/all");
    const { rooms } = await data.json();
    return rooms;
  } catch (error) {
    console.log(error);
  }
};

