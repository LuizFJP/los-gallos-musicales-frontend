import React from "react";
import { Link } from "react-router-dom";

export type RoomListProps = {
  rooms: string[];
}

const RoomList = (props: RoomListProps) => {

  return (
    <>
      {props.rooms.map((room, id) => (
        <Link to={`/room/${room}`}>
          <div key={id}>{room}</div>
        </Link>
      ))}
    </>
  );
};

export default RoomList;
