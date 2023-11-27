import { useEffect, useRef, useState } from "react";
import { Room } from "../../../domain/entities/room/room";
import { Socket } from "socket.io-client";
import EraserButton from "../tools/EraserButton";
import SizeSlider from "../tools/sizer";

import "./canvas.scss";
import { debounce, size } from "lodash";
import { useRoom } from "../../hooks/use-room";
import ColorPicker from "../tools/ColorPicker";

const DRAW_EVENT = 'draw';
const SAVE_EVENT = 'save';

export type CanvasProps = {
  socket?: Socket,
  roomName: string;
};

type Point = {
  x: number;
  y: number;
};

type Line = {
  start: Point;
  end: Point;
};


export const Canvas = ({ socket, roomName }: CanvasProps) => {
  const { room, artist } = useRoom();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const debouncedSave = useRef(
    debounce((nextValue) => saveCanvas(nextValue), 5000)
  ).current;
  const [ brushColor, setBrushColor ] = useState<string>("black");
  const [ eraserActivated, setEraserActivated ] = useState<boolean>(false);
  const [ brushSize, setBrushSize] = useState(10);

  const drawLine = (context: CanvasRenderingContext2D, line: Line, eraserActivated: boolean) => {
    if (!context) {
      console.error("Contexto não encontrado no draw");
      return;
    }

    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = brushSize;
    context.strokeStyle = eraserActivated ? "white" : brushColor;

    context.beginPath();
    context.moveTo(line.start.x, line.start.y);
    context.lineTo(line.end.x, line.end.y);
    context.stroke();
  }

  function toggleEraser (){
    setEraserActivated(!eraserActivated);
  };

  function changeBrushSize(size){
    setBrushSize(size);
  }

  const startDraw = async (context: CanvasRenderingContext2D | null) => {
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

    socket?.on(DRAW_EVENT, (line: Line) => {
      drawLine(context2d, line, eraserActivated);
    });

    function handleMouseDown(event: MouseEvent) {
      if (!canvas || !context2d  || !artist) return;

      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      startPoint = { x: offsetX, y: offsetY };
    }

    function handleMouseMove(event: MouseEvent) {
      if (!isDrawing || !canvas || !context2d || !artist) return;

      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

        if (!startPoint) return;

        const endPoint = { x: offsetX, y: offsetY };
        const line = { start: startPoint, end: endPoint };

        drawLine(context2d, line, eraserActivated);
        send(line);

        startPoint = endPoint;
  
    }
    
    function handleMouseUp() {
      isDrawing = false;
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      // socket?.off('draw')
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasRef.current, eraserActivated, brushColor, brushSize]);

  const saveCanvas = (data: any) => {
    console.log(room?.numberOfPlayers, room?.players)
    socket?.emit(
      SAVE_EVENT,
      room?.name,
      data
    );
  };

  const send = (line: Line) => {
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
      
      <SizeSlider brushSize={brushSize} setBrushSize={changeBrushSize} />  
      <EraserButton eraserActivated={eraserActivated} toggleEraser={toggleEraser} />
      <ColorPicker selectedColor={brushColor} onColorChange={setBrushColor} />
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
