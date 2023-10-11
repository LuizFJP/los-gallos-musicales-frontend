import React, { useState } from "react";
import { useEffect, useRef } from "react";
import Canvas from "../../components/canvas/canvas";
import { useParams } from "react-router-dom";
import { joinRoom } from "../../../infra/http/request-room";
import { Player, Room } from "../../../domain/entities/room/room";
import { PlayerList } from "../../components/lists/player-list/player-list";
import { Chat } from "../../components/chat/chat";

const Room: React.FC = () => {
  const { name } = useParams();
  const [room, setRoom] = useState<Room>();

   useEffect(() => {
    (async () => {
      const roomData = await joinRoom({
        userName: 'teste',
        penalties: 0,
        score: 0,
        wins: 0,
        avatar: 'teste'
      }, name as string);
      if (!roomData) {
        console.log("Erro ao entrar na sala");
      }
      await setRoom(roomData);
      console.log(room);
    })();
  }, []);

  const playerMock: Player[] = [
    {
      userName: "josefino",
      penalties: 0,
      score: 0,
      wins: 0,
      avatar: "../../../assets/avatars/avatar_01.png",
    } as Player,
    {
      userName: "pluton",
      penalties: 0,
      score: 0,
      wins: 0,
      avatar: "../../../assets/avatars/avatar_01.png",
    } as Player,    {
      userName: "zefron",
      penalties: 0,
      score: 0,
      wins: 0,
      avatar: "../../../assets/avatars/avatar_01.png",
    } as Player,    {
      userName: "florencio",
      penalties: 0,
      score: 0,
      wins: 0,
      avatar: "../../../assets/avatars/avatar_01.png",
    } as Player,    {
      userName: "japa",
      penalties: 0,
      score: 0,
      wins: 0,
      avatar: "../../../assets/avatars/avatar_01.png",
    } as Player, {
      userName: "zoro",
      penalties: 0,
      score: 0,
      wins: 0,
      avatar: "../../../assets/avatars/avatar_01.png",
    } as Player,
  ];

  return (
    <main className="container mx-auto flex p-16">
      <PlayerList players={playerMock} />
      <div className="flex flex-col mx-auto gap-2">
      <Canvas
        room={room}
        roomName={name as string}
      />
      <Chat />
      </div>
    </main>
  );
};

export default Room;
