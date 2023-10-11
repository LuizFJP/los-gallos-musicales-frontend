import { useEffect, useRef, useState } from "react";

import type { RefObject } from "react";
import { Room } from "../../../domain/entities/room/room";
import { debounce } from "lodash";
import { SocketConnection } from "../../../infra/websocket/websocket";

export type CanvasProps = {
  room?: Room;
};

export const Canvas = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>()
  const debouncedSave = useRef(
    debounce((nextValue) => saveCanvas(nextValue), 100)
  ).current;
  const socket = new SocketConnection();

  function drawCircle(
    context: CanvasRenderingContext2D | null,
    x: number,
    y: number
  ) {
    if (!context) return;

    context.fillStyle = "red";
    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.fill();
  }

  async function startDraw(context: CanvasRenderingContext2D | null) {
    const img = new Image();
    img.onload = () => context?.drawImage(img, 0, 0);
    img.src = props.room?.canvas as string;
  }

  useEffect(() => {
    const websocket = new SocketConnection();
    websocket.connect();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    setContext(canvas.getContext("2d"));

    if (!context) {
      console.error("Contexto 2D não suportado pelo navegador.");
      return;
    }

    startDraw(context);

    let isDrawing = false;

    socket.onDraw(`${props.room?.name} draw`, (data: any) => {
      drawCircle(context, data.x, data.y);
    });

    // Manipuladores de eventos para desenhar ao clicar e arrastar
    function handleMouseDown(event: MouseEvent) {
      if (!canvas) return;

      isDrawing = true;
      drawCircle(
        context as CanvasRenderingContext2D,
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
      );
      send(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
      );
    }

    function handleMouseMove(event: MouseEvent) {
      if (!isDrawing || !canvas) return;
      drawCircle(
        context as CanvasRenderingContext2D,
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
      );
      send(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
      );
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
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [drawCircle]);

  const clearCanvas = () => {
    if (context) {
      context.clearRect(0,0, canvasRef.current?.width as number, canvasRef.current?.height as number);
      socket.emitData(`${props.room?.name} save`, canvasRef.current?.toDataURL());
    }
  }

  const saveCanvas = (data: any) => {
    console.log('aaaaaaaaaaaaaaaaaaaaaaa')
    socket.emitData(`${name} save`, data);
  };

  const send = (x: number, y: number) => {
    const data = { x, y };
    socket.emitData(`${name} draw`, data);
    debouncedSave(canvasRef.current?.toDataURL());
  };


  return (
    <section className="justify-self-center mx-auto">
      <canvas
        ref={canvasRef}
        width={740}
        height={424}
        style={{ border: "4px solid #fff", borderRadius: "8px" }}
      />
      <button onClick={clearCanvas}>
        Limpar Tela
      </button>
    </section>
  );
};

export default Canvas;
