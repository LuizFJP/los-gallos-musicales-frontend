import { useEffect, useRef, useState } from "react";

import "./answer-chat.scss";
import { useSearchParams } from "react-router-dom";
import { chatProps } from "../chat";

export interface chatChildrenProps extends chatProps {}

interface Message {
  sender: string;
  text: string;
}

const AnswerChat = ({ socket, username }: chatChildrenProps) => {
  const inputRef = useRef<HTMLInputElement | null>();
  const [messages, setMessages] = useState<Message[]>([]);

  const [searchParams] = useSearchParams();
  const roomName = searchParams.get("name");

  const handleNewMessage = (message) => {
    console.log('recebeu mensagem', message)
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendTextMessage = (textMessage) => {
    console.log("mandou mensage", messages)
    socket.emit("answer-chat-message", roomName, textMessage);
    setMessages((prevMessages) => [...prevMessages, textMessage]);
    inputRef.current!.value = "";
  };

  useEffect(() => {
    console.log('entrou no useEffect')
    socket.on("answer-chat-message", handleNewMessage);
  }, []);

  const handleSendMessage = (event) => {
    event.preventDefault();
    const messageText = inputRef.current!.value;
    if (messageText && username) {
      const message = {
        sender: username,
        text: messageText,
      };
      sendTextMessage(message);
    }
  }

  return (
    <section className="p-2 h-full answer-chat relative">
      <div className="decor-answer absolute">
        <h1>Respostas</h1>
      </div>
      <div className="">
        <ul className="answer-chat-container flex flex-col justify-start overflow-y-scroll h-40">
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
          className="answer-input p-2 rounded-md flex flex-1"
          placeholder="Adivinhhe aqui"
          ref={inputRef}
        />
      </form>
    </section>
  );
};

export default AnswerChat;
