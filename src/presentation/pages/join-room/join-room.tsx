import { useEffect, useState } from 'react';
import { getRoomByShortLink } from '../../../infra/http/request-room';
import { useParams } from 'react-router-dom';

import './join-room.scss';
import { UserInfo } from '../../components/user/user-info';

export const JoinRoom = () => {
  const {shortId} = useParams();
  const [roomName, setRoomName] = useState<string>();

  useEffect(() => {
    getRoomByShortLink(shortId as string).then((roomFound) => setRoomName(roomFound?.name || ""));
  })

return (
    <main className="join-room-container">
      <header className="join-room-header">
        {roomName && (<h1>Você está prestes a entrar na sala {roomName}</h1>)}
      </header>
      <section className="join-room-content">
       {roomName && (<UserInfo roomName={roomName}/>)}
      </section>
    </main>
    )
}