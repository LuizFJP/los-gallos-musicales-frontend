import { useEffect, useRef, useState } from "react";
import { Room } from "../../../domain/entities/room/room";
import { Socket } from "socket.io-client";

import "./canvas.scss";
import { debounce } from "lodash";

const DRAW_EVENT = 'draw';
const SAVE_EVENT = 'save';

export type CanvasProps = {
  artist: boolean,
  socket?: Socket,
  room?: Room;
  roomName: string;
};

type point = {
  x: number;
  y: number;
};

type line = {
  start: point;
  end: point;
};


export const Canvas = ({ artist, socket, roomName, room }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const debouncedSave = useRef(
    debounce((nextValue) => saveCanvas(nextValue), 5000)
  ).current;

  const drawLine = (context: CanvasRenderingContext2D, line: line) => {
    if (!context) {
      console.error("Contexto não encontrado no draw");
      return;
    }

    context.lineJoin = 'round';
    context.lineCap = 'round'; 
    context.lineWidth = 5;
    context.strokeStyle = "black";
    context.lineWidth = 2;

    context.beginPath();
    context.moveTo(line.start.x, line.start.y);
    context.lineTo(line.end.x, line.end.y);
    context.stroke();
  }

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

  const startDraw =  async (context: CanvasRenderingContext2D | null) => {
    const img = new Image();
    img.onload = () => context?.drawImage(img, 0, 0);
    console.log(room?.canvas as string);
    img.src = room?.canvas as string;
  }

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

    startDraw(context2d);

    let isDrawing = false;
    let startPoint: { x: number; y: number } | null = null;

    socket?.on(DRAW_EVENT, (line: line) => {
      drawLine(context2d, line);
    });

    function handleMouseDown(event: MouseEvent) {
      if (!canvas || !context2d) return;

      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      startPoint = { x: offsetX, y: offsetY };
    }

    function handleMouseMove(event: MouseEvent) {
      if (!isDrawing || !canvas || !context2d) return;

      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      setTimeout(() => {
        if (!startPoint) return;

        const endPoint = { x: offsetX, y: offsetY };
        const line = { start: startPoint, end: endPoint };

        drawLine(context2d, line);
        send(line);

        startPoint = endPoint;
      }, 20);
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

  const saveCanvas = (data: any) => {
    socket?.emit(
      `save`,
      room?.name,
      {... room, canvas: data}
    );
  };

  const send = (line: line) => {
    const data = line;
    socket?.emit(DRAW_EVENT, roomName, data, (error) => {
      if (error) {
        console.error('Error sending drawing:', error);
      }
    });
    debouncedSave(canvasRef.current?.toDataURL());
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
