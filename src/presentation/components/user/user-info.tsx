import { MdCreate } from "react-icons/md";
import DefaultAvatar from "../../../assets/avatars/avatar_01.png";
import { useEffect, useRef, useState } from "react";

import "./user-info.scss";
import { AvatarModal } from "../modal/avatar-modal/avatar-modal";
import { requestImages } from "../../../infra/http/request-image";
import { useNavigate } from "react-router-dom";
import { BtnPrimary } from "../button/primary/btn-primary";
import {
  decryptUsername,
  encryptUsername,
} from "../../../infra/http/request-security";
import { checkRoomIsFull } from "../../../infra/http/request-room";

interface UserInfoProps {
  roomName: string;
}

export const UserInfo = ({roomName} : UserInfoProps) => {
  const [avatar, setAvatar] = useState<string>(DefaultAvatar);
  const [openModal, setOpenModal] = useState(false);
  const [avatarList, setAvatarList] = useState([]);
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();
  const imageRef = useRef<HTMLImageElement>(null);

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  const handleAvatarSelection = (selectedAvatar: string) => {
    setAvatar(selectedAvatar);
    imageRef.current?.setAttribute("src", selectedAvatar);
    setOpenModal(false);
  };

  useEffect(() => {
    requestImages().then((reqAvatarList) => {
      if (reqAvatarList) {
        setAvatarList(JSON.parse(reqAvatarList));
      }
    });
  });

  const handleGoToRoom = async (roomName, playerName) => {
    if (playerName) {
      const usernameEncrypted = await encryptUsername(playerName, roomName);
      const newUsername = await decryptUsername(usernameEncrypted);
      const { isFull } = await checkRoomIsFull(roomName);
      console.log(isFull);
      if (!isFull) {
        if (newUsername !== undefined && usernameEncrypted) {
          navigate(
            { pathname: `/room`, search: `?name=${roomName}` },
            {
              state: {
                created: false,
                username: newUsername,
                userImage: avatar,
              },
            }
          );
        }
      } else {
        alert("Sala cheia!");
      }
    }
  };

  return (
    <div className="user-info-container">
      {openModal && (
        <AvatarModal
          isOpen={openModal}
          avatarList={avatarList}
          onAvatarSelect={handleAvatarSelection}
          onCloseModal={handleModal}
        />
      )}
      <div className="avatar-container flex flex-col items-center justify-center relative">
        <img
          src={avatar}
          alt="user avatar"
          className="selected-avatar rounded-full object-cover h-32 w-32 borer-solid border-4 border-gray-700"
          ref={imageRef}
        />
        <div className="edit-avatar-container">
          <MdCreate
            size="24"
            className="edit-avatar cursor-pointer"
            onClick={handleModal}
          />
        </div>
      </div>
      <div className="user-info">
        <form action="" className="flex flex-col">
          <label
            htmlFor="username"
            className="flex flex-col gap-1 mb-2 font-bold text-lg text-zinc-950"
          >
            Apelido
            <input
              name="username"
              type="text"
              value={username}
              onChange={({ target }) => {
                setUsername(target.value);
              }}
              className="font-normal px-2 py-1 rounded-md"
            />
          </label>
          <label
            htmlFor="roomName"
            className="flex flex-col gap-1 font-bold text-lg"
          ></label>
          <div className="flex gap-4 flex-wrap items-center justify-center mt-4">
            <BtnPrimary
              text="Jogar!"
              btnType="button"
              onClick={() => handleGoToRoom(roomName, username)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
