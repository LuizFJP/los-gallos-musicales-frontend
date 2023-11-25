import { ElementType } from 'react';
import './btn-primary.scss';

export interface btnProps {
  text: string;
  onClick?: () => void | Promise<void>;
  icon?: ElementType;
  btnType: "button" | "submit" | "reset";
}


export const BtnPrimary = ({text, icon: Icon, onClick, btnType}: btnProps) => {
  return (
    <button className="btn-primary" onClick={onClick} type={btnType}>
      {text}
      {Icon && <Icon size={16} />}
    </button>
  )
}