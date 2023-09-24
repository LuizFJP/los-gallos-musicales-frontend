import { useState } from "react";
import { Room } from "../../domain/entities/Room";
import { createRoom } from "../../infra/http/request-room";

export const RoomSettings = () => {

  const [roomData, setRoomData] = useState<Room>();

  const handleChange = ({target: {name,value}}) => {
    setRoomData((prev) => ({
      ...prev, 
      [name]: value,
    }));
  }

  return (
    <main className="container mx-auto">
      <h1>Configuração da Sala</h1>
      <section>
        <form className="flex flex-col gap-4" onSubmit={() => createRoom(roomData as Room)}>
        <label htmlFor="name">
            Nome da sala
            <input name="name" type="text" onChange={handleChange}/>
          </label>
          <label className="flex flex-col gap-1" htmlFor="genreId">
          Gênero musical
            <select name="genreId" id="" onChange={handleChange}>
              <option value="minha piroca grossa">minha piroca grossa</option>
              <option value="minha piroca fina">minha piroca fina</option>
            </select>
          </label>
          <label htmlFor="maxPlayers">
            Número  máximo de jogadores
            <input name="maxPlayers" type="text" onChange={handleChange}/>
          </label>
          <label htmlFor="roundDuration">
            Duração da rodada
            <input name="roundDuration" type="number" onChange={handleChange}/>
          </label>
          <label htmlFor="roundInterval">
            Duração do intervalo
            <input name="roundInterval" type="number" onChange={handleChange}/>
          </label>
          <button type="submit">Gerar sala</button>
        </form>
      </section>
    </main >
  )
}
