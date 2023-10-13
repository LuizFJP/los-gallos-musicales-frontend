import { useRef } from "react";
import { socket } from "../../../../infra/websocket/websocket";
import { MdCreate, MdSend } from "react-icons/md";
import { BtnPrimary } from "../../button/primary/btn-primary";

import "./answer-chat.scss";

const AnswerChat = () => {
  const inputRef = useRef<HTMLInputElement>();

  const answersMock = [
    {
      username: "josefino",
      answer: "Maçã",
    },
    {
      username: "pluton",
      answer: "Maracujá",
    },
    {
      username: "zefron",
      answer: "Banana",
    },
    {
      username: "florencio",
      answer: "Melância",
    },
    {
      username: "Josefino",
      answer: "Melão",
    },
    {
      username: "japa",
      answer: "Laranja",
    },
    {
      username: "zoro",
      answer: "Limão",
    },
  ];

  const sendTextMessage = (textMessage) => {
    socket.on("talk-chat-message", (message) => {
      console.log(message);
    });
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    console.log(event);
  };

  return (
    <section className="p-2">
      <div className="answer-chat-container">
        <ul className="answer-list flex flex-col gap-2 justify-start">
          {answersMock.map((answer, index) => (
            <li
              className="answer flex items-center justify-start text-xs gap-2"
              key={index}
            >
              <span className="user-name">{answer.username}: </span>
              <span className="answer-chat-text">{answer.answer}</span>
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
          className="answer-input p-2 rounded-md flex w-60"
          placeholder="Converse aqui"
          ref={inputRef}
        />
        <BtnPrimary text="Enviar" btnType="submit" icon={MdSend}/>
      </form>
    </section>
  );
};
export default AnswerChat;
