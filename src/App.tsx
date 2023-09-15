import React, { Fragment, useState } from "react";
import Websocket from "./Websocket";

const App: React.FC = () => {
  const [room, setRoom] = useState<string>("");
  const [toggle, setToggle] = useState<boolean>(false);

  function handleRoomClick(e: React.ChangeEvent<HTMLInputElement>) {
    setRoom(e.currentTarget.value);
  }

  async function enterRoom() {
    setToggle(!toggle);
  }

  async function handleToggleClick() {
      await fetch("http://localhost:8100/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({room}),
    });
  setToggle(!toggle);
  }


  if (!toggle) {
    return (
      <Fragment>
        <label htmlFor="">
          Nome da sala
          <input type="text" value={room} onChange={handleRoomClick}/>
        </label>
        <input type="button" value="enviar" onClick={handleToggleClick}/>
        <div>
          <label htmlFor="">
            entrar na sala
            <input type="text" value={room} onChange={handleRoomClick}/>
          </label>
          <input type="button" value="enviar" onClick={enterRoom}/>
        </div>
      </Fragment>
    );
  } else {
    return(
    <Fragment>
      <Websocket room={room}/>
    </Fragment>);
  }
};

export default App;
