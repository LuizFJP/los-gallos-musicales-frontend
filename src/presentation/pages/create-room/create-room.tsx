import { useEffect, useState } from "react";
import { Room } from "../../../domain/entities/room/room";
import { createRoom } from "../../../infra/http/request-room";
import { useLocation, useNavigate } from "react-router-dom";
import { getGenres } from "../../../infra/http/request-genre";
import { Genre } from "../../../domain/entities/ genre/genre";
import { getSongs } from "../../../infra/http/request-playlist";
import { encryptUsername } from "../../../infra/http/request-security";
import ActionModal from "../../components/modal/action-modal/action-modal";
import { MdWarningAmber } from "react-icons/md";

export const CreateRoom = () => {
  const [roomData, setRoomData] = useState<Room>();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


  const navigate = useNavigate();
  const location = useLocation();
  const { username, avatar} = location.state as {username: string, avatar: string};

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
    const usernameEncrypted = await encryptUsername(username, roomData?.name as string);
    createRoom({ ...roomData, players: [{
      username,
      penalties: 0,
      score: 0,
      wins: 0,
      avatar: 'rioso',
      artist: false,
    }], currentPlayers: 0, listSongs}).then((res) => {
      if (res.error) {
        setError(res.error);
        setIsModalOpen(true);
        return;
      }
      if (usernameEncrypted !== undefined) {
        navigate({pathname: `/room`, search:`?name=${roomData?.name}`}, {state: {created: true, username}})
      }
    }
    );
    }

  return (
    <main className="container mx-auto flex justify-center items-center flex-col min-w-full min-h-full mt-40 relative">
      {isModalOpen && (
        <ActionModal 
          icon={MdWarningAmber}
          iconColor={'#ffbf00'}
          isOpen={isModalOpen}
          title="Erro ao criar sala"
          description={"Já existe uma sala com este nome"}
          confirmText="Tentar novamente"
          hasCancel={false}
          onConfirm={() => {
            setIsModalOpen(false);
          }}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      )}
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
