import React, { RefObject } from "react";
import type { Socket } from "socket.io-client";

export type CanvasProps = {
  socket: Socket;
  canvasRef: RefObject<HTMLCanvasElement>;
};

export const Canvas = (props: CanvasProps) => {
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
