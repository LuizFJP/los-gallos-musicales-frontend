import React, { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { socket } from "../../../../infra/websocket/websocket";
import { BtnPrimary } from "../../button/primary/btn-primary";

import "./talk-chat.scss";

const TalkChat = () => {
  const inputRef = useRef<HTMLInputElement | null>();
  const [messages, setMessages] = useState<string[]>([]);

  const handleNewMessage = (message) => {
    setMessages([...messages, message]);
  };

  const sendTextMessage = (textMessage) => {
    socket.emit("talk-chat-message", textMessage);
    setMessages([...messages, textMessage]);
    inputRef.current!.value = "";
  };

  useEffect(() => {
    socket.connect();
    socket.on("talk-chat-message", handleNewMessage);

    return () => {
      // Clean up the event listener when the component is unmounted
      // socket.off("talk-chat-message", handleNewMessage);
      socket.disconnect();
    };
  }, [messages]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    sendTextMessage(inputRef.current?.value);
  };

  return (
    <section className="p-2 h-full talk-chat relative">
      <div className="decor absolute">
        <h1>Conversas</h1>
      </div>
      <div className="">
        <ul className="talk-chat-container flex flex-col gap-2 justify-start overflow-y-scroll h-40">
          {messages.length > 0 &&
            messages.map((message, index) => (
              <li
                className="chat-message flex items-center justify-start gap-2"
                key={index}
              >
                <span className="answer-chat-text">{message}</span>
              </li>
            ))}
        </ul>
      </div>
      <form
        className="answer-container mt-3 flex gap-2"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          className="talk-input p-2 rounded-md flex flex-1"
          placeholder="Converse aqui"
          ref={inputRef}
        />
      </form>
    </section>
  );
};

export default TalkChat;
