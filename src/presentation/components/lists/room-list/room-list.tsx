import { useNavigate } from "react-router-dom";
import TitleDecor from "../../../../assets/title-decor.png";

import "./room-list.scss";
import { encryptUsername } from "../../../../infra/http/request-security";
import { useState } from "react";

export type RoomListProps = {
  rooms: string[];
  userName: string;
  userAvatar: string;
};

const RoomList = (props: RoomListProps) => {
  const navigate = useNavigate();

  const handleClick = async (roomName) => {
    console.log(props.userName);
    if (props.userName) {
      const username = await encryptUsername(props.userName);
      if (username !== undefined) {
        navigate(`room/?name=${roomName}&user=${username}`);
      }
    }
  };

  return (
    <div className="room-list justify-center text-center ">
      <figure>
        <img src={TitleDecor} className="relative" />
        <h1 className="text-3xl room-title absolute font-black">Salas</h1>
      </figure>
      <ul className="list-items p-2 mt-4 rounded-md flex items-start justify-center gap-6 flex-wrap overflow-y-scroll">
        {props.rooms.map((room, id) => (
          <li
            key={id}
            className="p-4 rounded-md hover:bg-gray-200 hover:cursor-pointer hover:text-gray-800 mt-4"
          >
            <button
              className="p-2"
              onClick={() => {
                handleClick(room);
              }}
            >
              <span>{room}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
