import AnswerChat from "./answer/answer-chat";
import TalkChat from "./talk/talk-chat";

export const Chat = () => {
  return <section className="grid grid-cols-2 outline outline-2 outline-gray-50 p-4 rounded-lg items-start justify-center">
    <AnswerChat />
    <TalkChat />
  </section>;
};
