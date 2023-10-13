import { Link } from "react-router-dom";
import TitleDecor from "../../../../assets/title-decor.png";

import "./room-list.scss";

export type RoomListProps = {
  rooms: string[];
  userName: string;
  userAvatar: string;
};

const RoomList = (props: RoomListProps) => {

  return (
    <div className="room-list justify-center text-center ">
      <figure>
        <img src={TitleDecor} className="relative"/>
        <h1 className="text-3xl room-title absolute font-black">Salas</h1>
      </figure>
    <ul className="list-items p-2 mt-4 rounded-md flex items-start justify-center gap-6 flex-wrap overflow-y-scroll">
      {props.rooms.map((room, id) => (
        <li key={id} className="p-4 rounded-md hover:bg-gray-200 hover:cursor-pointer hover:text-gray-800 mt-4">
          <Link to={`/room/${room}`} className="p-2">
            <span>{room}</span>
          </Link>
        </li>
      ))}
    </ul>
    </div>
  );
};

export default RoomList;
