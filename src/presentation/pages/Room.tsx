import { debounce } from "lodash";
import React from "react";
import { useEffect, useRef } from "react";
import Canvas from "../components/Canvas";
import { useParams } from "react-router-dom";
import { SocketConnection } from "../../infra/websocket/websocket";


const Room: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const socket = new SocketConnection();
    const {name} = useParams();

    const debouncedSave = useRef(debounce((nextValue) => saveCanvas(nextValue), 1000)).current;


    const saveCanvas = (data: any) => {
      console.log(data);
      socket.emitData(`${name} save`, data)
    }

    const send = (x: number, y: number) => {
      let data = {x,y};
      socket.emitData(`${name} draw`, data);
      debouncedSave(canvasRef.current?.toDataURL());
    }

    return (
      <>
        <Canvas socket={socket} canvasRef={canvasRef} handleCanvasDataTransmission={send} roomName={name}/>
      </>
    );
}

export default Room;