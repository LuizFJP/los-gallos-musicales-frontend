import { debounce } from "lodash";
import React, { useState } from "react";
import { useEffect, useRef } from "react";
import Canvas from "../../components/canvas/canvas";
import { useParams } from "react-router-dom";
import { SocketConnection } from "../../../infra/websocket/websocket";
import { joinRoom } from "../../../infra/http/request-room";
import { Player, Room } from "../../../domain/entities/room/room";
import { PlayerList } from "../../components/lists/player-list/player-list";
import { Chat } from "../../components/chat/chat";

const Room: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socket = new SocketConnection();
  const { name } = useParams();
  const [room, setRoom] = useState<Room>();

  const debouncedSave = useRef(
    debounce((nextValue) => saveCanvas(nextValue), 100)
  ).current;

  useEffect(() => {
    (async () => {
      const roomData = await joinRoom({
        userName: 'teste',
        penalties: 0,
        score: 0,
        wins: 0,
        avatar: 'teste'
      }, name as string);
      if (!roomData) return;
      setRoom(roomData);
      console.log(room);
    })();
  }, []);

  const saveCanvas = (data: any) => {
    console.log(data);
    socket.emitData(`${name} save`, data);
  };

  const send = (x: number, y: number) => {
    const data = { x, y };
    socket.emitData(`${name} draw`, data);
    debouncedSave(canvasRef.current?.toDataURL());
  };

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
        socket={socket}
        canvasRef={canvasRef}
        handleCanvasDataTransmission={send}
        room={room}
      />
      <Chat />
      </div>
    </main>
  );
};

export default Room;
