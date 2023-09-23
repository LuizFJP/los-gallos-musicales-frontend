import React, { useEffect, useState } from "react";
import RoomList from "../components/RoomList";
import { createRoom, loadRooms } from "../../infra/http/request-room";

const App: React.FC = () => {
  const [room, setRoom] = useState<string>("");
  const [roomList, setRoomList] = useState<string[]>([]);

  useEffect(() => {
    loadRooms().then((rooms) => {
      if (rooms) {
        setRoomList(rooms);
      }
    });
  }, [createRoom]);

  function handleRoomClick(e: React.ChangeEvent<HTMLInputElement>) {
    setRoom(e.currentTarget.value);
  }

  async function handleToggleClick() {
    createRoom(room);
  }

  return (
    <main className="container mx-auto p-4">
      <header></header>
      <section>
        <label htmlFor="roomName">
          Nome da sala
          <input
            name="roomName"
            type="text"
            value={room}
            onChange={handleRoomClick}
          />
        </label>
        <input type="button" value="enviar" onClick={handleToggleClick} />
        {roomList && <RoomList rooms={roomList} />}
      </section>
    </main>
  );
};

export default App;
