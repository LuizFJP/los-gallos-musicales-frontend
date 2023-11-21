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
      <section className="share-modal-container">
        <div className="share-modal-content">
          <div className="share-modal-header">
              <h1 className="text-amber-600">link da sala</h1>
            <div className="text-zinc-300 hover:text-zinc-600">
              <MdClose size={40} onClick={onClose}/>
            </div>
          </div>
          <div className="share-modal-body">
              <p className="share-modal-link">{shortLink}</p>
              <button className="share-modal-copy-button hover:bg-zinc-400" type="button">
                <MdContentCopy size={24} onClick={handleLinkCopy}/>
              </button>
          </div>
            <div className="share-modal-footer mb-6">
              <BtnPrimary onClick={() => {
                handleLinkCopy();
                onClose();
              }} text="compartilhar" btnType="button"/>
          </div>
        </div>
      </section>
    )
  )
}