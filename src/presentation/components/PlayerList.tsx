import { Player } from "../../domain/entities/Room"

export type PlayerListProps = {
  players: Player[]
}

export const PlayerList = (props: PlayerListProps) => {
  return (
    <section>
      <ul className="flex flex-col gap-4">
      {props.players.map((player) => (
        <li key={player.userName} className="flex flex-col gap-1">
          <div>
            <img src={player.avatar} alt="" />
          </div>
          <span className="text-gray-950 text-lg">{player.userName}</span>
          <span className="text-gray-950 text-lg">{player.score}</span>
        </li>
      ))}
      </ul>
    </section>
  )
}