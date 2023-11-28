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
const BRUSH_SIZE_CHANGE_EVENT = 'brushSizeChange';
const ERASER_ACTIVATED_CHANGE_EVENT = 'eraserActivatedChange';
const BRUSH_COLOR_CHANGE_EVENT = 'brushColorChange';

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
  //const [cursor, setCursor] = useState(eraserActivated ? eraserCursor : brushCursor);

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
    setEraserActivated((prevEraserActivated) => {
      const newEraserActivated = !prevEraserActivated;
      //setCursor(newEraserActivated ? eraserCursor : brushCursor);
      sendEraserActivated(newEraserActivated);
      return newEraserActivated;
    });
  };

  function changeBrushSize(size) {
    setBrushSize(size);
    sendBrushSize(size);
  }

  function changeBrushColor(color) {
    setBrushColor(color);
    sendBrushColor(color);
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

    socket?.on(BRUSH_SIZE_CHANGE_EVENT, (data) => {
      const newSize = data && data.size;
      if (newSize !== undefined) {
        setBrushSize(newSize);
      }
    });
    
    socket?.on(ERASER_ACTIVATED_CHANGE_EVENT, ({ eraserActivated }) => {
      setEraserActivated(eraserActivated);
    });

    socket?.on(BRUSH_COLOR_CHANGE_EVENT, (brushColor) => {
      setBrushColor(brushColor);
    }); 
    
    //setCursor(eraserActivated ? eraserCursor : brushCursor);

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

  function sendBrushSize(brushSize) {
    socket?.emit(BRUSH_SIZE_CHANGE_EVENT, roomName, { size: brushSize }, (error) => {
      if (error) {
        console.error('Error sending brush size:', error);
      }
    });
    debouncedSave(canvasRef.current?.toDataURL());
  }

  function sendEraserActivated(eraserActivated) {
    socket?.emit(ERASER_ACTIVATED_CHANGE_EVENT, roomName, { eraserActivated }, (error) => {
      if (error) {
        console.error('Error sending eraser activated:', error);
      }
    });
    debouncedSave(canvasRef.current?.toDataURL());
  }

  function sendBrushColor(brushColor) {
    socket?.emit('brushColorChange', roomName, brushColor, (error) => {
      if (error) {
        console.error('Error sending brush color:', error);
      }
    });
    debouncedSave(canvasRef.current?.toDataURL());
  }

    return (
      <section className="canvas-container justify-self-center mx-auto">
        
        <SizeSlider brushSize={brushSize} setBrushSize={changeBrushSize} artist={!artist} />  
        <EraserButton eraserActivated={eraserActivated} toggleEraser={toggleEraser} artist={!artist} />
        <ColorPicker selectedColor={brushColor} onColorChange={changeBrushColor} artist={!artist}/>
        <canvas
          height={"444px"}
          width={"994px"}
          //style={{ cursor: `url(${cursor}) 0 20, auto` }}
          ref={canvasRef}
          className="drawing-canvas"
        />
      </section>
  );
};

export default Canvas;
