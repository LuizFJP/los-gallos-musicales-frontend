import { useEffect } from 'react';
import { getRoomByShortLink } from '../../../infra/http/request-room';
import { useParams } from 'react-router-dom';

import './join-room.scss';

export const JoinRoom = () => {
  const {shortId} = useParams();
  useEffect(() => {
    getRoomByShortLink(shortId as string).then((res) => console.log(res));
  })
  return (
    <main className="join-room-container">
      <header className="join-room-header">
        <h1>Você está prestes a entrar na sala {shortId}</h1>
      </header>
      <section className="join-room-content">
        <div className="join-room-select-avatar-container">
          <span>Escolha uma imagem de perfil</span>
          <img src="" alt="" className="join-room-avatar"/>
        </div>
        <div className="join-room-username-container">
          <h2>Escolha um nome de usuário</h2>
          <input type="text" id="joinRoomUsername" className="join-room-username" />
          <button type="button" className="join-room-button">Entrar</button>
        </div>
      </section>
    </main>
  )
}