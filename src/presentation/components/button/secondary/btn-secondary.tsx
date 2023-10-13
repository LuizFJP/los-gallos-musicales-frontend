import { ElementType } from 'react';
import './btn-secondary.scss';

export interface btnProps {
  text: string;
  onClick?: () => void;
  icon?: ElementType;
  btnType: "button" | "submit" | "reset";
}


export const BtnSecondary = ({text, icon: Icon, onClick, btnType}: btnProps) => {
  return (
    <button className="btn-secondary" onClick={onClick} type={btnType}>
      {text}
      {Icon && <Icon size={16} />}
    </button>
  )
}