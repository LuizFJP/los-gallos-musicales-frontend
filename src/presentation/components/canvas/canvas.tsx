import { useEffect, useRef, useState } from "react";

import { Room } from "../../../domain/entities/room/room";
import { debounce } from "lodash";
import { SocketConnection } from "../../../infra/websocket/websocket";

export type CanvasProps = {
  room?: Room;
  roomName: string;
};

export const Canvas = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const [contextState, setContextState] = useState<CanvasRenderingContext2D | null>();
  const debouncedSave = useRef(
    debounce((nextValue) => saveCanvas(nextValue), 100)
  ).current;
  const socket = new SocketConnection();

  const drawCircle = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    if (!context) {
      console.log("Contexto não encontrado no draw");
      return;
    }

    context.fillStyle = "red";
    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.fill();
  }

  const startDraw =  async (context: CanvasRenderingContext2D | null) => {
    const img = new Image();
    img.onload = () => context?.drawImage(img, 0, 0);
    console.log("netrou aqui");
    img.src = props.room?.canvas as string;
    console.log(props.room);
  }
  const saveCanvas = (data: any) => {
    socket.emitData(`${props.roomName} save`, data);
  };

  const send = (x: number, y: number) => {
    const data = { x, y };
    
    socket.emitData(`${props.roomName} draw`, data);
    debouncedSave(canvasRef.current?.toDataURL());
  };
  useEffect(() => {
    socket.connect();
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas não encontrado");
      return;
    }
    const context2d = canvas.getContext("2d");
    setContextState(context2d);

    if (!context2d) {
      console.error("Contexto 2D não suportado pelo navegador.");
      return;
    }

    startDraw(context2d);

    let isDrawing = false;

    socket.onDraw(`${props.roomName} draw`, (data: any) => {
      drawCircle(context2d, data.x, data.y);
    });

    // Manipuladores de eventos para desenhar ao clicar e arrastar
    function handleMouseDown(event: MouseEvent) {
      if (!canvas) return;

      isDrawing = true;
      drawCircle(
        context2d as CanvasRenderingContext2D,
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
      );
      send(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }

    function handleMouseMove(event: MouseEvent) {
      if (!isDrawing || !canvas) return;
      drawCircle(
        context2d as CanvasRenderingContext2D,
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop
      );
      send(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
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
  }, []);

  const clearCanvas = () => {
    if (contextState) {
      contextState.clearRect(
        0,
        0,
        canvasRef.current?.width as number,
        canvasRef.current?.height as number
      );
      socket.emitData(
        `${props.roomName} save`,
        canvasRef.current?.toDataURL()
      );
    }
  };



  return (
    <section className="justify-self-center mx-auto">
      <canvas
        ref={canvasRef}
        width={740}
        height={424}
        style={{ border: "4px solid #fff", borderRadius: "8px" }}
      />
      <button onClick={clearCanvas}>Limpar Tela</button>
    </section>
  );
};

export default Canvas;
