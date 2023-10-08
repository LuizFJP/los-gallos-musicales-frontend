const TalkChat = () => {
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
  return (
    <section className="h-full border-l-2 border-solid border-gray-50 p-4">
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
      <div className="answer-container mt-3">
        <input type="text" className="answer-input p-2 rounded-md" placeholder="Converse aqui" />
      </div>
    </section>
  )
}
export default TalkChat;