import AnswerChat from "./answer/answer-chat";
import TalkChat from "./talk/talk-chat";

import "./chat.scss";

export const Chat = () => {
  return <section className="chat-container flex flex-wrap p-4 rounded-lg items-end justify-between">
    <AnswerChat />
    <TalkChat />
  </section>;
};
