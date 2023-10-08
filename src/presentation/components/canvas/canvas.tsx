import { useEffect, useState } from "react";

import type { RefObject } from "react";
import { WebSocketProtocol } from "../../../infra/protocols/websocket-protocol";
import { Room } from "../../../domain/entities/room/room";

export type CanvasProps = {
  socket: WebSocketProtocol;
  canvasRef: RefObject<HTMLCanvasElement>;
  handleCanvasDataTransmission: (x: number, y: number) => void;
  room?: Room;
};

export const Canvas = (props: CanvasProps) => {

  const [context, setContext] = useState<CanvasRenderingContext2D | null>()

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
    const canvas = props.canvasRef.current;
    if (!canvas) return;

    setContext(canvas.getContext("2d"));

    if (!context) {
      console.error("Contexto 2D não suportado pelo navegador.");
      return;
    }

    startDraw(context);

    let isDrawing = false;

    props.socket.onDraw(`${props.room?.name} draw`, (data: any) => {
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
      props.handleCanvasDataTransmission(
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
      props.handleCanvasDataTransmission(
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
      context.clearRect(0,0, props.canvasRef.current?.width as number, props.canvasRef.current?.height as number);
      props.socket.emitData(`${props.room?.name} save`, props.canvasRef.current?.toDataURL());
    }
  }

  return (
    <section className="justify-self-center mx-auto">
      <canvas
        ref={props.canvasRef}
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
