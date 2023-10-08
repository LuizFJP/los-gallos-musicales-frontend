import { useState } from "react";
import { Room } from "../../../domain/entities/room/room";
import { createRoom } from "../../../infra/http/request-room";
import { useNavigate } from "react-router-dom";

export const CreateRoom = () => {
  const [roomData, setRoomData] = useState<Room>();

  const handleChange = ({ target: { name, value } }) => {
    setRoomData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  return (
    <main className="container mx-auto flex justify-center items-center flex-col min-w-full min-h-full mt-40">
      <h1 className="2xl:text-4xl lg:text-3xl md:text-xl text-lg mb-4">Configuração da Sala</h1>
      <section>
        <form
          className="flex flex-col gap-4 w-96 h-96"
          onSubmit={() => {
            createRoom({ ...roomData, players: [], currentPlayers: 0 });
            navigate(`/room/${roomData?.name}`);
          }}
        >
          <label htmlFor="name" className="flex flex-col gap-1">
            Nome da sala
            <input name="name" type="text" onChange={handleChange} className="p-2 rounded-sm w-96 text-gray-950 bg-gray-50"/>
          </label>
          <label className="flex flex-col gap-1" htmlFor="genreId">
            Gênero musical
            <select name="genreId" id="" onChange={handleChange} className="p-2 rounded-sm w-96 text-gray-950 bg-gray-50">
              <option value="minha piroca grossa">Rock</option>
              <option value="minha piroca fina">Pop</option>
              <option value="minha piroca fina">Sertanejo</option>
              <option value="minha piroca fina">Rap</option>
            </select>
          </label>
          <label htmlFor="maxPlayers">
            Número máximo de jogadores
            <input name="maxPlayers" type="text" onChange={handleChange} className="p-2 rounded-sm w-96 text-gray-950 bg-gray-50"/>
          </label>
          <label htmlFor="roundDuration">
            Duração da rodada
            <input name="roundDuration" type="number" onChange={handleChange} className="p-2 rounded-sm w-96 text-gray-950 bg-gray-50"/>
          </label>
          <label htmlFor="roundInterval">
            Duração do intervalo
            <input name="roundInterval" type="number" onChange={handleChange} className="p-2 rounded-sm w-96 text-gray-950 bg-gray-50"/>
          </label>
          <button type="submit" className="bg-gray-800 text-gray-200 rounded-sm px-8 py-2 mt-4">Gerar sala</button>
        </form>
      </section>
    </main>
  );
};
