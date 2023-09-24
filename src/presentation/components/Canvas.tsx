import React, { useEffect } from "react";
import type { RefObject } from "react";
import { WebSocketProtocol } from "../../infra/protocols/websocket-protocol";
import { Room } from "../../domain/entities/Room";

export type CanvasProps = {
  socket: WebSocketProtocol;
  canvasRef: RefObject<HTMLCanvasElement>;
  handleCanvasDataTransmission: (x: number, y: number) => void;
  room?: Room;
};

export const Canvas = (props: CanvasProps) => {
  function drawCircle(
    context: CanvasRenderingContext2D | null,
    x: number,
    y: number
  ) {
    if (!context) return;

    context.fillStyle = "blue";
    context.beginPath();
    context.arc(x, y, 10, 0, Math.PI * 2);
    context.fill();
  }

  async function startDraw(context: CanvasRenderingContext2D | null) {
    var img = new Image();
    img.onload = () => context?.drawImage(img, 0, 0);
    img.src = props.room?.canvas as string;
  }

  useEffect(() => {
    const canvas = props.canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");

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
        context,
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
        context,
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

  const connect = () => {
    props.socket.connect();
  };

  const disconnect = () => {
    props.socket.disconnect();
  };

  return (
    <section>
      <canvas
        ref={props.canvasRef}
        width={400}
        height={400}
        style={{ border: "1px solid black" }}
      />
      <button type="button" onClick={connect}>
        Click
      </button>
      <button type="button" onClick={disconnect}>
        Click disconnect
      </button>
    </section>
  );
};

export default Canvas;
