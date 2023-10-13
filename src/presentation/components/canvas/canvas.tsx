import { useEffect, useRef, useState } from "react";
import { Room } from "../../../domain/entities/room/room";
import { debounce } from "lodash";
import { socket } from "../../../infra/websocket/websocket";
import { useParams } from "react-router-dom";

import "./canvas.scss";

const DRAW_EVENT = 'draw';
const SAVE_EVENT = 'save';

export type CanvasProps = {
  room?: Room;
  roomName: string;
};

export const Canvas = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [contextState, setContextState] = useState<CanvasRenderingContext2D | null>();
  const debouncedSave = useRef(
    debounce((nextValue) => saveCanvas(nextValue), 100)
  ).current;
  const { name } = useParams();

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

  const startDraw = async (context: CanvasRenderingContext2D | null) => {
    const img = new Image();
    img.onload = () => context?.drawImage(img, 0, 0);
    img.src = props.room?.canvas as string;
  };

  useEffect(() => {
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

    socket.on(DRAW_EVENT, (data: any) => {
      console.log('received');
      drawCircle(context2d, data.x, data.y);
    });

    // Manipuladores de eventos para desenhar ao clicar e arrastar
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
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasRef.current, props.room]);

  const clearCanvas = () => {
    if (contextState) {
      contextState.clearRect(0, 0, canvasRef.current?.width as number, canvasRef.current?.height as number);
      saveCanvas(canvasRef.current?.toDataURL());
    }
  };

  const saveCanvas = (data: any) => {
    socket.emit(SAVE_EVENT, name as string, {
      ...props.room,
      canvas: canvasRef.current?.toDataURL(),
    }, (error) => {
      if (error) {
        console.error('Error saving canvas:', error);
      }
    });
  };

  const send = (x: number, y: number) => {
    const data = { x, y };
    socket.emit(DRAW_EVENT, name as string, data, (error) => {
      if (error) {
        console.error('Error sending drawing:', error);
      }
    });
    debouncedSave(canvasRef.current?.toDataURL());
  };

  return (
    <section className="justify-self-center mx-auto">
      <canvas
        ref={canvasRef}
        width={922}
        height={538}
        className="drawing-canvas"
      />
      <button onClick={clearCanvas}>Limpar Tela</button>
    </section>
  );
};

export default Canvas;
