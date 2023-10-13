import AnswerChat from "./answer/answer-chat";
import TalkChat from "./talk/talk-chat";

import "./chat.scss";

export const Chat = () => {
  return <section className="chat-container grid grid-cols-2 p-4 rounded-lg items-start justify-center">
    <AnswerChat />
    <TalkChat />
  </section>;
};
