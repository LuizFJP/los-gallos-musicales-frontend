import { debounce } from "lodash";
import React from "react";
import { Fragment, useEffect, useRef } from "react";
import { io } from "socket.io-client";

interface WebSocketProps {
    room: string;
}

const Websocket: React.FC<WebSocketProps> = (props: WebSocketProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const socket = io("ws://localhost:8100");

    const debouncedSave = useRef(debounce((nextValue) => saveCanvas(nextValue), 1000)).current;

    function drawCircle(context: CanvasRenderingContext2D | null, x: number, y: number) {
      if (!context) return;

      context.fillStyle = "blue";
      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2);
      context.fill();
    }

    async function startDraw(context: CanvasRenderingContext2D | null) {
      const res = await fetch("http://localhost:8100")
      const draw = await res.json();
      var img = new Image();
      img.onload = () => context?.drawImage(img,0,0);
      img.src = draw.img;

    }

     useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");

      if (!context) {
        console.error("Contexto 2D não suportado pelo navegador.");
        return;
      }

      startDraw(context);

      let isDrawing = false;

      socket.on('draw', (data: any) => {
        drawCircle(context, data.x, data.y);
      })

      // Função para desenhar um círculo


      // Manipuladores de eventos para desenhar ao clicar e arrastar
      function handleMouseDown(event: MouseEvent) {
        if (!canvas) return;

        isDrawing = true;
        drawCircle(context,
          event.clientX - canvas.offsetLeft,
          event.clientY - canvas.offsetTop
        );
        send(event.clientX - canvas.offsetLeft,
          event.clientY - canvas.offsetTop);
      }

      function handleMouseMove(event: MouseEvent) {
        if (!isDrawing || !canvas) return;
        drawCircle(context,
          event.clientX - canvas.offsetLeft,
          event.clientY - canvas.offsetTop
        );
        send(event.clientX - canvas.offsetLeft,
          event.clientY - canvas.offsetTop);
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

    const saveCanvas = (data: any) => {
      console.log(data);
      socket.emit("save", data)
    }

    const send = (x: number, y: number) => {
      let data = {x,y};
      socket.emit("draw", data);
      debouncedSave(canvasRef.current?.toDataURL());
    }

    const connect = () => {
      socket.connect();

    }

    const disconnect = () => {
      socket.disconnect();
    }

    return (
      <Fragment>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{ border: "1px solid black" }}
        />
        <button type="button" onClick={connect}>Click</button>
        <button type="button" onClick={disconnect}>Click disconnect</button>
      </Fragment>
    );
}

export default Websocket;