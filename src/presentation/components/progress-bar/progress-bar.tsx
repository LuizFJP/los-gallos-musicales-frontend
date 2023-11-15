import ProgressBar from "@ramonak/react-progress-bar"
import { Room } from "../../../domain/entities/room/room"
import { useEffect, useState } from "react";


interface ProgressBarProps {
  timer: number;
  room: Room;
}

export const ProgressBarComponent = ({timer, room}: ProgressBarProps) => {
  const [percentage, setPercentage] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState("00");

  useEffect(() => {
    const newPercentage =
      (timer / (parseInt(room?.roundDuration as string) as number * 60)) * 100;
    const newMinutes = Math.floor(timer / 60);
    const newSeconds = (timer % 60).toString();
    const formattedSeconds = parseInt(newSeconds) < 10 ? `0${newSeconds}` : newSeconds;

    setPercentage(newPercentage);
    setMinutes(newMinutes);
    setSeconds(formattedSeconds);
  }, [timer, room]);

  return (

    <article>
      <ProgressBar
        animateOnRender
        initCompletedOnAnimation={100}
        customLabel={`${minutes}:${seconds}`}
        completed={Math.floor(percentage)}
        bgColor = {"#ff8000"}
        baseBgColor ={"#0b2990"}
        transitionTimingFunction="linear"
        labelAlignment="right"
        labelSize="12px"
        height="12px"
        ariaValuemin={10}
      />
    </article>
  )
}
