import React, { useEffect, useState } from "react";
import RoomList from "../../components/lists/room-list/room-list";
import { loadRooms } from "../../../infra/http/request-room";
import Logo from "../../../assets/galinho.png";
import DefaultAvatar from "../../../assets/avatars/avatar_01.png";
import { MdCreate } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Room } from "../../../domain/entities/room/room";
import { requestImages } from "../../../infra/http/request-image";
import { AvatarModal } from "../../components/modal/avatar-modal/avatar-modal";
import TextLogo from "../../../assets/new-logo.svg";

import "./home.scss";
import { BtnSecondary } from "../../components/button/secondary/btn-secondary";
import { BtnPrimary } from "../../components/button/primary/btn-primary";

const Home: React.FC = () => {
  const [room, setRoom] = useState<Room>();
  const [roomList, setRoomList] = useState<string[]>([]);
  const [username, setUsername] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [avatarList, setAvatarList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [originalRoomList, setOriginalRoomList] = useState<string[]>([]);

  const navigate = useNavigate();

  const loadRoomList = () => {
    loadRooms().then((rooms) => {
      if (rooms) {
        setRoomList(rooms);
        setOriginalRoomList(rooms);
      }
    });
  };

  useEffect(() => {
    loadRoomList();

    requestImages().then((reqAvatarList) => {
      if (reqAvatarList) {
        setAvatarList(JSON.parse(reqAvatarList));
      }
    });
  }, []);

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    const searchText = event.target.value.toLowerCase();
    if (searchText === "") {
      setRoomList(originalRoomList);
    } else {
      const filteredRooms = originalRoomList.filter((room) =>
        room.toLowerCase().includes(searchText)
      );
      setRoomList(filteredRooms);
    }
  }
  const handleAvatarSelection = (selectedAvatar: string) => {
    setAvatar(selectedAvatar);
    setOpenModal(false);
  };

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  const handleGoToCreateRoom = () => {
    navigate("/room-settings",
     { state: { username, avatar}})
  }

return (
  <main className="container mx-auto px-4 items-center justify-center flex-wrap w-full h-full relative">
    {openModal && (
      <AvatarModal
        isOpen={openModal}
        avatarList={avatarList}
        onAvatarSelect={handleAvatarSelection}
        onCloseModal={handleModal}
      />
    )}
    <header className="flex justify-center items-center h-48 flex-wrap flex-1">
      <div className="w-28 h-28 flex items-center justify-center">
        <img src={Logo} alt="galinho lgcm" />
      </div>
      <div className="">
        <figure>
          <img
            src={TextLogo}
            alt="los gallos musicalles"
            className="text-logo"
          />
          <figcaption className="font-sans font-black text-lg">
            Desenhe, Adivinhe, Ganhe
          </figcaption>
        </figure>
      </div>
    </header>
    <section className="main-container relative">
      <div className="flex flex-col flex-wrap items-center justify-center">
        <div className="mb-2">
          <div className="avatar-container flex flex-col items-center justify-center relative">
            <img
              src={avatar ? avatar : DefaultAvatar}
              alt=""
              className="selected-avatar rounded-full object-cover h-32 w-32 borer-solid border-4 border-gray-700"
            />
            <div className="edit-avatar-container">
              <MdCreate
                size="24"
                className="edit-avatar cursor-pointer"
                onClick={handleModal}
              />
            </div>
          </div>
          <p className="text-sm mt-2 font-bold">Escolha seu avatar</p>
        </div>
        <div className="action-container">
          <form action="" className="flex flex-col">
            <label
              htmlFor="username"
              className="flex flex-col gap-1 mb-2 font-bold text-lg"
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
            >
              Nome da sala
              <input
                name="roomName"
                type="text"
                value={room?.name}
                className="font-normal px-2 py-1 rounded-md "
                onChange={handleInput}
              />
            </label>
            <div className="flex gap-4 flex-wrap items-center justify-center mt-4">
              <BtnSecondary onClick={handleGoToCreateRoom} text="Criar Sala" btnType="button" />
              <BtnPrimary text="Jogar!" btnType="submit" />
            </div>
          </form>
        </div>
      </div>
      <div className="w-1 h-96 mx-auto right-0 -left-28 bg-gray-500 absolute rounded-lg"></div>
      <div className="room-list-container">
        {roomList && (
          <RoomList
            rooms={roomList}
            userName={username}
            userAvatar={avatar}
          />
        )}
      </div>
    </section>
  </main>
);
};

export default Home;
