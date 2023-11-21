import { MdOutlineShare } from "react-icons/md";


import "./room-share-button.scss";

interface roomShareButtonProps {
  clickAction: () => void;
}

export const RoomShareButton = ({clickAction}:roomShareButtonProps) => {


  return (
    <div className="share-button-container" onClick={clickAction}>
      <button className="share-button" type="button" >
        <MdOutlineShare size={32} color={'#fff' } />
      </button>
    </div>
  )
}