import AnswerChat from "./answer/answer-chat";
import TalkChat from "./talk/talk-chat";

import "./chat.scss";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decryptUsername } from "../../../infra/http/request-security";
import { Socket } from "socket.io-client";

export interface chatProps {
  socket: Socket;
}

export const Chat = ({socket}: chatProps) => {

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
    <AnswerChat socket={socket} userName={username && username}/>
    <TalkChat socket={socket} userName={username && username}/>
  </section>;
};
