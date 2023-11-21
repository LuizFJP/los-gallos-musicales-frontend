import { MdClose, MdContentCopy } from "react-icons/md";

import "./share-modal.scss";
import { BtnPrimary } from "../../button/primary/btn-primary";

interface ShareModalProps {
  shortLink: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal = ({shortLink, isOpen, onClose}:ShareModalProps) => {

  const handleLinkCopy  = () => {
    navigator.clipboard.writeText(shortLink);
  }

  return (
    isOpen && (
      <section className="share-modal-container" onClick={onClose}>
        <div className="share-modal-content">
          <div className="share-modal-header">
            <h1>Compartilhe o link da sala</h1>
            <MdClose size={32} onClick={onClose}/>
          </div>
          <div className="share-modal-body">
              <p className="share-modal-link">{shortLink}</p>
              <button className="share-modal-copy-button" type="button">
                <MdContentCopy size={32} onClick={handleLinkCopy}/>
              </button>
          </div>
            <div className="share-modal-footer">
              <BtnPrimary onClick={onClose} text="compartilhar" btnType="button"/>
          </div>
        </div>
      </section>
    )
  )
}