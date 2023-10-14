import React, { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { socket } from "../../../../infra/websocket/websocket";
import { BtnPrimary } from "../../button/primary/btn-primary";

import "./talk-chat.scss";

export interface chatProps {
  userName: string;
}

interface Message {
  sender: string;
  text: string;
}

const TalkChat = ({userName} : chatProps) => {
  const inputRef = useRef<HTMLInputElement | null>();
  const [messages, setMessages] = useState<Message[]>([]);

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
      socket.off("talk-chat-message", handleNewMessage);
      socket.disconnect();
    };
  }, [messages]);

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
