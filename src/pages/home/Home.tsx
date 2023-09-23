import React, { Fragment, useState } from "react";
import Websocket from "../../Websocket";
import Rooms from "./Rooms";

const App: React.FC = () => {
  const [room, setRoom] = useState<string>("");

  function handleRoomClick(e: React.ChangeEvent<HTMLInputElement>) {
    setRoom(e.currentTarget.value);
  }

  async function handleToggleClick() {
    await fetch("http://localhost:8100/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ room }),
    });
  }

  return (
    <Fragment>
      <label htmlFor="">
        Nome da sala
        <input type="text" value={room} onChange={handleRoomClick} />
      </label>
      <input type="button" value="enviar" onClick={handleToggleClick} />
      <Rooms />
    </Fragment>
  );

};

export default App;
