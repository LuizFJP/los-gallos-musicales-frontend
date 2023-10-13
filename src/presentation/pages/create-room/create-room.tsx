import { useEffect, useState } from "react";
import { Room } from "../../../domain/entities/room/room";
import { createRoom } from "../../../infra/http/request-room";
import { useNavigate, useSubmit } from "react-router-dom";
import { getGenres } from "../../../infra/http/request-genre";
import { Genre } from "../../../domain/entities/ genre/genre";
import { getSongs } from "../../../infra/http/request-playlist";

export const CreateRoom = () => {
  const [roomData, setRoomData] = useState<Room>();
  const [genres, setGenres] = useState<Genre[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const genres = await getGenres();
      setGenres(genres);
      setRoomData({ ...roomData, genre: genres[0].genre})
    })();
  }, [])

  const handleChange = ({ target: { name, value } }) => {
    setRoomData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const handleSubmit = async () => {
    const listSongs = await getSongs(roomData?.genre as string);
    createRoom({ ...roomData, players: [{
      username: 'teste',
      penalties: 0,
      score: 0,
      wins: 0,
      avatar: 'rioso',
      artist: false,
    }], currentPlayers: 0, listSongs});
    navigate(`/room/${roomData?.name}`);
  }

  return (
    <main className="container mx-auto flex justify-center items-center flex-col min-w-full min-h-full mt-40">
      <h1 className="2xl:text-4xl lg:text-3xl md:text-xl text-lg mb-4">Configuração da Sala</h1>
      <section>
        <form
          className="flex flex-col gap-4 w-96 h-96">
          <label htmlFor="name" className="flex flex-col gap-1">
            Nome da sala
            <input name="name" type="text" onChange={handleChange} className="p-2 rounded-sm w-96 text-gray-950 bg-gray-50"/>
          </label>
          <label className="flex flex-col gap-1" htmlFor="genreId">
            Gênero musical
            <select name="genre" id="" onChange={handleChange} className="p-2 rounded-sm w-96 text-gray-950 bg-gray-50">
              {genres.map((genre, index) => <option key={index} value={genre.genre}>{genre.genre}</option>)}
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
          <button type="button" onClick={handleSubmit} className="bg-gray-800 text-gray-200 rounded-sm px-8 py-2 mt-4">Gerar sala</button>
        </form>
      </section>
    </main>
  );
};
