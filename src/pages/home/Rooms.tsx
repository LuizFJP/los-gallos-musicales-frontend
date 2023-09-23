import React from "react";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Rooms: React.FC = () => {

  const [rooms, setRooms] = useState<string[]>([""]);
  
  async function loadRooms() {
    const data = await fetch("http://localhost:8100/room/all")
    const { rooms } = await data.json();
    setRooms(rooms);
  }

  useEffect(() => {
     loadRooms();
  }, [])

  return (
    <Fragment>
      {rooms.map((room, id) => (
        <Link to={`/room/${room}`}>
          <div key={id}>
            {room}
          </div>
        </Link>
      ))}
    </Fragment>
  )
}

export default Rooms;
