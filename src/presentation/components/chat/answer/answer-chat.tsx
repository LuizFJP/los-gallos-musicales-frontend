const AnswerChat = () => {
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
  return (
    <section className="h-full border-r-2 border-solid border-gray-50 p-4">
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
      <div className="answer-container mt-3">
        <input type="text" className="answer-input p-2 rounded-md" placeholder="Adivinhe aqui" />
      </div>
    </section>
  )
}
export default AnswerChat;