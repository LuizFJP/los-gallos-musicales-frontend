import { MdOutlineShare } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { createRoomShortLink } from "../../../../infra/http/request-room";
import { useEffect, useState } from "react";
import { ShareModal } from "../../modal/share-modal/share-modal";

import "./room-share-button.scss";

export const RoomShareButton = () => {

  const [searchParams] = useSearchParams();
  const roomName = searchParams.get("name") as string;
  const [shortLink, setShortLink] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    createRoomShortLink(roomName).then((roomShortLink: string) => {
      setShortLink(roomShortLink);
    })
  }, [])

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <div className="share-button-container" onClick={handleModalOpen}>
      {isModalOpen && (
        <ShareModal shortLink={`http://localhost:5173/share/${shortLink}`} isOpen={isModalOpen} onClose={handleModalOpen}/>
      )}
      <button className="share-button" type="button" >
        <MdOutlineShare size={32} color={'#fff' } />
      </button>
    </div>
  )
}