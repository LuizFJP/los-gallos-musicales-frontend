import AnswerChat from "./answer/answer-chat";
import TalkChat from "./talk/talk-chat";

import "./chat.scss";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decryptUsername } from "../../../infra/http/request-security";

export const Chat = () => {

  const [searchParams] = useSearchParams();
  const user = searchParams.get("user");
  const [username, setUsername] = useState<string>("");
  
  useEffect(() => {
    decryptUsername(user as string).then((res) => {
      if (res != undefined) {
        setUsername(res);
      }
    })
  },[user]);

  return <section className="chat-container flex flex-wrap p-4 rounded-lg items-end justify-between">
    <AnswerChat userName={username && username}/>
    <TalkChat userName={username && username}/>
  </section>;
};
