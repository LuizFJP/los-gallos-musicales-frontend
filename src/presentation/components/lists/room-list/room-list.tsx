import { Link, useNavigate } from "react-router-dom";
import { joinRoom } from "../../../../infra/http/request-room";
import { Player } from "../../../../domain/entities/room/room";



export type RoomListProps = {
  rooms: string[];
  userName: string;
  userAvatar: string;
};

const RoomList = (props: RoomListProps) => {
  
  const navigate = useNavigate();
  function goToRoom(roomName: string) {
    console.log(roomName)
    navigate(`/room/?name=${roomName}`)
  }

  return (
    <div className="w-full h-96 flex flex-col justify-center ">
      <h1 className="font-sans text-3xl">Salas Criadas</h1>
      <p className="font-serif text-sm">Escolha uma para jogar</p>
      <ul className="h-80 p-8 mt-4 rounded-md flex items-start justify-center gap-6 flex-wrap border-4 border-solid border-gray-100 overflow-y-scroll">
        {props.rooms.map((room, id) => (
          <li key={id} className="px-4 py-2 border-2 border-solid border-gray-100 rounded-md hover:bg-gray-200 hover:cursor-pointer hover:text-gray-800 mt-4">
              <span onClick={() => goToRoom(room)}>{room}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
