import AnswerChat from "./answer/answer-chat";
import TalkChat from "./talk/talk-chat";

import "./chat.scss";
import { Socket } from "socket.io-client";

export interface chatProps {
  socket: Socket;
  username: string;
  songName: string;
}

export const Chat = ({socket, username, songName}: chatProps) => {

  return <section className="chat-container flex flex-wrap p-4 rounded-lg items-end justify-between">
    <AnswerChat socket={socket} username={username && username} songName={songName}/>
    <TalkChat socket={socket} username={username && username} songName={songName} />
  </section>;
};
