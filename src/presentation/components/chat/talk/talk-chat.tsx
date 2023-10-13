import { useRef } from "react";
import { SocketConnection } from "../../../../infra/websocket/websocket";
import { MdSend } from "react-icons/md";

const TalkChat = () => {
  const socket = new SocketConnection();
  const inputRef = useRef<HTMLInputElement>();
  const messagesMock = [
    {
      username: 'josefino',
      text: 'Maçã'
    },    {
      username: 'pluton',
      text: 'Maracujá'
    },    {
      username: 'zefron',
      text: 'Banana'
    },    {
      username: 'florencio',
      text: 'Melância'
    },    {
      username: 'Josefino',
      text: 'Melão'
    },    {
      username: 'japa',
      text: 'Laranja'
    },    {
      username: 'zoro',
      text: 'Limão'
    },
  ]

  const sendTextMessage = (textMessage) => {
    socket.emitData('talk-chat-message', textMessage);
    socket.on('talk-chat-message', (message) => { 
      console.log(message);
    });

  }

  const handleSendMessage = (event) => {
    event.preventDefault();
    sendTextMessage(inputRef.current?.value);
    console.log(inputRef);
  }

  return (
    <section className="p-2">
      <div className="answer-chat-container">
        <ul className="flex flex-col gap-2 justify-start">
          {messagesMock.map((message, index) => (
            <li className="answer flex items-center justify-start text-xs gap-2" key={index}>
              <span className="user-name">{message.username}: </span>
              <span className="answer-chat-text">{message.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <form className="answer-container mt-3 flex gap-2" onSubmit={handleSendMessage}>
        <input type="text" className="talk-input p-2 rounded-md flex w-60" placeholder="Converse aqui" ref={inputRef} />
        <button type="submit" className="flex items-center justify-center gap-2 text-sm border-solid border-2 border-gray-50 py-2 px-4 rounded-md hover:bg-gray-300 hover:text-gray-600 transition-colors">Enviar <MdSend size={16} /></button>
      </form>
    </section>
  )
}
export default TalkChat;