import React from "react";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadRooms } from "../../infra/http/request-room";

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<string[]>([""]);

  useEffect(() => {
    loadRooms().then((rooms) => {
      if (rooms) {
        setRooms(rooms);
      }
    });
  }, []);

  return (
    <Fragment>
      {rooms.map((room, id) => (
        <Link to={`/room/${room}`}>
          <div key={id}>{room}</div>
        </Link>
      ))}
    </Fragment>
  );
};

export default RoomList;
