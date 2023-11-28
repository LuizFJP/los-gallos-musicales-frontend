import { useEffect, useRef, useState } from "react";
import "./answer-chat.scss";
import { useSearchParams } from "react-router-dom";
import { chatProps } from "../chat";
import Fuse from "fuse.js";
import { useRoom } from "../../../hooks/use-room";

export interface chatChildrenProps extends chatProps {}

interface Message {
  sender: string;
  text: string;
  songName?: string;
}

const AnswerChat = ({ socket, username, songName }: chatChildrenProps) => {
  const inputRef = useRef<HTMLInputElement | null>();
  const [messages, setMessages] = useState<Message[]>([]);
  const {artist} = useRoom();
  const [searchParams] = useSearchParams();
  const roomName = searchParams.get("name");

  const songNameList = [{ songName }];
  const fuseOptions = {
    inCaseSensitive: true,
    includeScore: true,
    threshold: 0.2,
    keys: ["songName"],
  };

  const handleNewMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const checkAnswer = (message) => {
    const fuse = new Fuse(songNameList, fuseOptions);
    const result = fuse.search(message.text);
    if (result.length > 0) {
      const textMessage = {
        sender: "Sistema",
        text: `${message.sender} acertou a música!`,
      };
      socket.emit("update-score", roomName, username, result[0].score);
      socket.emit("answer-chat-message", roomName, textMessage);
      setMessages((prevMessages) => [...prevMessages, textMessage]);
    }
  }

  const sendTextMessage = (textMessage) => {
    socket.emit("answer-chat-message", roomName, textMessage);
    setMessages((prevMessages) => [...prevMessages, textMessage]);
    inputRef.current!.value = "";
  };

  useEffect(() => {
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
      checkAnswer(message)
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
          placeholder={artist ? "Você não pode adivinhar" : "Adivinhhe aqui"}
          ref={inputRef}
          disabled={artist}
        />
      </form>
    </section>
  );
};

export default AnswerChat;
