import React, { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { startSocket } from "../../../../infra/websocket/websocket";
import { BtnPrimary } from "../../button/primary/btn-primary";

import "./talk-chat.scss";
import { useSearchParams } from "react-router-dom";

export interface chatProps {
  userName: string;
}

interface Message {
  sender: string;
  text: string;
}


const TalkChat = ({ userName }: chatProps) => {
  const inputRef = useRef<HTMLInputElement | null>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<any>(null);

  const [searchParams] = useSearchParams();

  const handleNewMessage = (message) => {
    setMessages([...messages, message]);
  };

  const sendTextMessage = (textMessage) => {
    socket.emit("talk-chat-message", textMessage);
    setMessages([...messages, textMessage]);
    inputRef.current!.value = "";
  };

  useEffect(() => {
    setSocket(startSocket(searchParams.get("name") as string));

  if (socket) {
    // When 'socket' is available, set up the event listener
    socket.on("talk-chat-message", handleNewMessage);

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off("talk-chat-message", handleNewMessage);
      socket.disconnect();
    };
  }
  }, [messages, socket]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    const messageText = inputRef.current!.value;
    if (messageText && userName) {
      const message = {
        sender: userName,
        text: messageText,
      };
      sendTextMessage(message);
    }
  }

  return (
    <section className="p-2 h-full talk-chat relative">
      <div className="decor-talk absolute">
        <h1>Conversas</h1>
      </div>
      <div className="">
        <ul className="talk-chat-container flex flex-col justify-start overflow-y-scroll h-40">
          {messages.length > 0 &&
            messages.map((message: Message, index) => (
              <li
                className="chat-message"
                key={index}
              >
                <span className="chat-text">{message.sender}: {""}</span>
                <span className="chat-text">{message.text}</span>
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
