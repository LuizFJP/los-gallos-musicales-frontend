import { useEffect, useRef, useState } from "react";
import { Room } from "../../../domain/entities/room/room";
import { debounce } from "lodash";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";

import "./canvas.scss";

const DRAW_EVENT = 'draw';
const SAVE_EVENT = 'save';

export type CanvasProps = {
  socket?: Socket,
  room?: Room;
  roomName: string;
};

export const Canvas = ({socket, roomName}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawCircle = (context: CanvasRenderingContext2D, x: number, y: number) => {
    if (!context) {
      console.error("Contexto não encontrado no draw");
      return;
    }

    context.fillStyle = "red";
    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas não encontrado");
      return;
    }
    const context2d = canvas.getContext("2d");

    if (!context2d) {
      console.error("Contexto 2D não suportado pelo navegador.");
      return;
    }

    let isDrawing = false;

    socket?.on(DRAW_EVENT, (data: any) => {
      console.log('received');
      drawCircle(context2d, data.x, data.y);
    });

    function handleMouseDown(event: MouseEvent) {
      if (!canvas) return;

      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      drawCircle(context2d as CanvasRenderingContext2D, offsetX, offsetY);
      send(offsetX, offsetY);
    }

    function handleMouseMove(event: MouseEvent) {
      if (!isDrawing || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      drawCircle(context2d as CanvasRenderingContext2D, offsetX, offsetY);
      send(offsetX, offsetY);
    }

    function handleMouseUp() {
      isDrawing = false;
    }

    // Adicionando ouvintes de eventos ao canvas
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    // Removendo ouvintes de eventos quando o componente é desmontado
    return () => {
      // socket?.off('draw')
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasRef.current]);

  const send = (x: number, y: number) => {
    const data = { x, y };
    socket?.emit(DRAW_EVENT, roomName, data, (error) => {
      if (error) {
        console.error('Error sending drawing:', error);
      }
    });
  };

  return (
    <section className="canvas-container justify-self-center mx-auto">
      <canvas
      height={"444px"}
      width={"994px"}
        ref={canvasRef}

        className="drawing-canvas"
      />
    </section>
  );
};

export default Canvas;
