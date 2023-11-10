import { Player } from "../../../../domain/entities/room/room"
import Avatar from "../../../../assets/avatars/avatar_01.png"

import "./player-list.scss";

export type PlayerListProps = {
  players: Player[]
}

export const PlayerList = (props: PlayerListProps) => {
  console.log(props.players)
  return (
    <section className="player-list-container">
      <ul className="player-list flex flex-col gap-4 overflow-y-scroll rounded-lg p-6">
      {props.players.map((player, index) => (
        <li key={index} className="flex items-center justify-start gap-4 hover:bg-gray-300 p-2 rounded-lg hover:text-gray-950 text-sm lg:text-lg text-gray-50">
          <div className="avatar-container">
            <img src={Avatar} alt="" className="selected-avatar rounded-full object-cover h-24 w-24 borer-solid border-4 border-gray-50"/>
          </div>
          <div className="player-info flex flex-col gap-2 ">
          <span className="">{player.username}</span>
          <span className="">{player.score} pts</span>
          </div>
        </li>
      ))}
      </ul>
    </section>
  )
}