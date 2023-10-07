import { Link } from "react-router-dom";
import { joinRoom } from "../../infra/http/request-room";
import { Player } from "../../domain/entities/Room";

export type RoomListProps = {
  rooms: string[];
  userName: string;
  userAvatar: string;
};

const RoomList = (props: RoomListProps) => {
  const player: Player = {
    userName: props.userName,
    avatar: props.userAvatar,
    wins: 0,
    score: 0,
    penalties: 0,
  }
  const handleJoinRoom = async (roomName: string) => {
    await joinRoom(player, roomName);
  }

  return (
    <div className="w-full h-96 flex flex-col justify-center ">
      <h1 className="font-sans text-3xl">Salas Criadas</h1>
      <p className="font-serif text-sm">Escolha uma para jogar</p>
    <ul className="h-80 p-8 mt-4 rounded-md flex items-start justify-center gap-6 flex-wrap border-4 border-solid border-gray-100 overflow-y-scroll">
      {props.rooms.map((room, id) => (
        <li key={id} className="px-4 py-2 border-2 border-solid border-gray-100 rounded-md hover:bg-gray-200 hover:cursor-pointer hover:text-gray-800 mt-4">
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
