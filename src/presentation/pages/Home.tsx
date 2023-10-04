import React, { useEffect, useState } from "react";
import RoomList from "../components/RoomList";
import { loadRooms } from "../../infra/http/request-room";
import Logo from "../../assets/galinho.png";
import Avatar from "../../assets/avatars/avatar_01.png";
import { MdCreate } from "react-icons/md";
import { Link } from "react-router-dom";
import { Room } from "../../domain/entities/Room";

const Home: React.FC = () => {
  const [room, setRoom] = useState<Room>();
  const [roomList, setRoomList] = useState<string[]>([]);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    loadRooms().then((rooms) => {
      if (rooms) {
        setRoomList(rooms);
      }
    });
  }, []);

  return (
    <main className="container mx-auto px-4 items-center justify-center flex-wrap">
      <header className="flex justify-center items-center h-48 flex-wrap flex-1">
        <div className="w-28 h-28 flex items-center justify-center">
          <img src={Logo} alt="galinho lgcm" />
        </div>
        <div className="">
          <h1 className="font-cursive text-5xl w-80 text-center">
            Los Gallos Musicales
          </h1>
          <p className="text-center font-serif text-sm">
            Divirta-se com muitas musicas
          </p>
        </div>
      </header>
      <section className="flex items-end justify-center flex-wrap gap-12">
        <div className="mt-12 flex flex-col flex-wrap items-center justify-center">
          <div className="mb-8">
            <div className="avatar-container flex flex-col items-center justify-center relative">
              <img
                src={Avatar}
                alt=""
                className="selected-avatar rounded-full object-cover h-40 w-40 borer-solid border-4 border-gray-50"
              />
              <MdCreate
                size="32"
                className="absolute bottom-0 right-0 rounded-full text-gray-50 bg-gray-600 border-solid border-2 border-gray-50"
              />
            </div>
            <p className="font-mono text-sm mt-2 font-bold text-gray-100">
              Escolha seu avatar
            </p>
          </div>
          <div className="action-container">
            <form action="" className="flex flex-col">
              <label
                htmlFor="username"
                className="flex flex-col gap-1 mb-2 font-mono font-bold text-lg"
              >
                Apelido
                <input
                  name="username"
                  type="text"
                  value={username}
                  onChange={({target}) => {setUsername(target.value)}}
                  className="font-sans font-normal text-gray-950 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </label>
              <label
                htmlFor="roomName"
                className="flex flex-col gap-1 font-mono font-bold text-lg"
              >
                Nome da sala
                <input
                  name="roomName"
                  type="text"
                  value={room?.name}
                  className="font-sans font-normal text-gray-950 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </label>
              <div className="flex gap-4 flex-wrap items-center justify-center font-mono font-bold">
                <button
                  type="button"
                  value="enviar"
                  className="bg-gray-600 text-gray-200 rounded-sm px-8 py-2 mt-4"
                >
                  Jogar
                </button>
                <Link to="/room-settings">
                <button
                  type="button"
                  value="enviar"
                  className="bg-gray-800 text-gray-200 rounded-sm px-8 py-2 mt-4"
                >
                    Criar Sala
                </button>
                  </Link>
              </div>
            </form>
          </div>
        </div>
        <div>{roomList && <RoomList rooms={roomList} />}</div>
      </section>
    </main>
  );
};

export default Home;
