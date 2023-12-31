import { useNavigate } from "react-router-dom";
import TitleDecor from "../../../../assets/title-decor.png";

import "./room-list.scss";
import { encryptUsername, decryptUsername } from '../../../../infra/http/request-security';
import { checkRoomIsFull } from "../../../../infra/http/request-room";

export type RoomListProps = {
  rooms: string[];
  username: string;
  userAvatar: string;
};

const RoomList = ({ rooms, username, userAvatar }: RoomListProps) => {
  const navigate = useNavigate();

  const handleGoToRoom = async (roomName, playerName) => {
    if (playerName) {
      const usernameEncrypted = await encryptUsername(playerName, roomName);
      const newUsername = await decryptUsername(usernameEncrypted);
      const { isFull } = await checkRoomIsFull(roomName);
      if (!isFull) {
        if (newUsername !== undefined && usernameEncrypted) {
          navigate({ pathname: `/room`, search: `?name=${roomName}` }, { state: { created: false, username: newUsername } });
        }
      } else {
        alert('Sala cheia!');
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
        {rooms.map((room, id) => (
          <li
            key={id}
            className="p-4 rounded-md hover:bg-gray-200 hover:cursor-pointer hover:text-gray-800 mt-4"
          >
            <button
              className="p-2"
              onClick={() => {
                handleGoToRoom(room, username);
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
