import { debounce } from "lodash";
import React, { useState } from "react";
import { useEffect, useRef } from "react";
import Canvas from "../components/Canvas";
import { useParams } from "react-router-dom";
import { SocketConnection } from "../../infra/websocket/websocket";
import { joinRoom } from "../../infra/http/request-room";
import { Player, Room } from "../../domain/entities/Room";
import { PlayerList } from "../components/PlayerList";

const Room: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socket = new SocketConnection();
  const { name } = useParams();
  const [room, setRoom] = useState<Room>();

  const debouncedSave = useRef(debounce((nextValue) => saveCanvas(nextValue), 100)).current;

  useEffect(() => {
    (async () => {
      const roomData = await joinRoom(name as string);
      if (!roomData) return;
      setRoom(roomData);
      console.log(room)
    })();
  }, [])


  const saveCanvas = (data: any) => {
    console.log(data);
    socket.emitData(`${name} save`, data)
  }

  const send = (x: number, y: number) => {
    const data = { x, y };
    socket.emitData(`${name} draw`, data);
    debouncedSave(canvasRef.current?.toDataURL());
  }

  return (
    <main className="container mx-auto flex p-16">
      {/* <PlayerList players={room?.players as Player[]} /> */}
      <Canvas socket={socket} canvasRef={canvasRef} handleCanvasDataTransmission={send} room={room} />
    </main>
  );
}

export default Room;