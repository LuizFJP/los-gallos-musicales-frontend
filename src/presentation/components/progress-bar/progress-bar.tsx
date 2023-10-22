import ProgressBar from "@ramonak/react-progress-bar"
import { Room } from "../../../domain/entities/room/room"

interface ProgressBarProps {
  room?: Room;
}

export const ProgressBarComponent = ({room}: ProgressBarProps) => {

  return (
    <article>
      <ProgressBar
        customLabel="01:00"
        completed={50}
        className="progress-wrapper"
        barContainerClassName="progress-container"
        completedClassName="progress-barCompleted"
        labelClassName="progress-label"
      />
    </article>
  )
}
