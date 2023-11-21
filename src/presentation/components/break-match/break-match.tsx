import "./break-match.scss";
import Galinho from "../../../../src/assets/galinho_zueira.png";


interface BreakMatchProps {
  previousSongName: string | undefined;
}

export const BreakMatch = ({previousSongName}: BreakMatchProps) => {
  return (
    <div className="break-match-container">
      <img src={Galinho} alt="galinho zueira" className="galinho-zueira"/>
      <h1 className="text-lg xl:text-2xl lg:text-xl font-bold">INTERVALO</h1>
      <p className="flex flex-col items-center justify-start text-sm lg:text-lg xl:text-2xl text-blue-600 font-medium">A resposta era:  <span className="font-bold text-amber-500">{previousSongName}</span></p>
    </div>
  )
}