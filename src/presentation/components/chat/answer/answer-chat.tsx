import { useRef } from "react";
import { socket } from "../../../../infra/websocket/websocket";
import { MdSend } from "react-icons/md";

const AnswerChat = () => {

  const inputRef = useRef<HTMLInputElement>();

  const answersMock = [
    {
      username: 'josefino',
      answer: 'Maçã'
    },    {
      username: 'pluton',
      answer: 'Maracujá'
    },    {
      username: 'zefron',
      answer: 'Banana'
    },    {
      username: 'florencio',
      answer: 'Melância'
    },    {
      username: 'Josefino',
      answer: 'Melão'
    },    {
      username: 'japa',
      answer: 'Laranja'
    },    {
      username: 'zoro',
      answer: 'Limão'
    },
  ]

  const sendTextMessage = (textMessage) => {
    socket.on('talk-chat-message', (message) => { 
      console.log(message);
    });
  }

  const handleSendMessage = (event) => {
    event.preventDefault();
    console.log(event);
  }

  return (
    <section className="p-2">
      <div className="answer-chat-container">
        <ul className="flex flex-col gap-2 justify-start">
          {answersMock.map((answer, index) => (
            <li className="answer flex items-center justify-start text-xs gap-2" key={index}>
              <span className="user-name">{answer.username}: </span>
              <span className="answer-chat-text">{answer.answer}</span>
            </li>
          ))}
        </ul>
      </div>
      <form className="answer-container mt-3 flex gap-2" onSubmit={handleSendMessage}>
        <input type="text" className="answer-input p-2 rounded-md flex w-60" placeholder="Converse aqui" ref={inputRef} />
        <button type="submit" className="flex items-center justify-center gap-2 text-sm border-solid border-2 border-gray-50 py-2 px-4 rounded-md hover:bg-gray-300 hover:text-gray-600 transition-colors">Enviar <MdSend size={16} /></button>
      </form>
    </section>
  )
}
export default AnswerChat;