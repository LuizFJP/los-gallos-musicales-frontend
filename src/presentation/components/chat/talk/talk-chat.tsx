import { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { socket } from "../../../../infra/websocket/websocket";
import { BtnPrimary } from "../../button/primary/btn-primary";

import "./talk-chat.scss";

const TalkChat = () => {
  const inputRef = useRef<HTMLInputElement | null>();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.connect();
    socket.on("talk-chat-message", (messageList) => {
      console.log(messageList);
      setMessages(messageList);
    });
  }, [messages]);

  const sendTextMessage = (textMessage) => {
    socket.emit("talk-chat-message", textMessage);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    sendTextMessage(inputRef.current?.value);
    setMessages([...messages, inputRef.current?.value as string]);
    inputRef.current!.value = "";
  };

  return (
    <section className="p-2 h-full">
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
          className="talk-input p-2 rounded-md flex w-60"
          placeholder="Converse aqui"
          ref={inputRef}
        />
  <BtnPrimary text="Enviar" btnType="submit" icon={MdSend}/>
      </form>
    </section>
  );
};
export default TalkChat;
