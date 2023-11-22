import { MdClose, MdContentCopy } from "react-icons/md";

import "./share-modal.scss";
import { BtnPrimary } from "../../button/primary/btn-primary";
import { useRef, useState } from "react";

interface ShareModalProps {
  shortLink: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal = ({ shortLink, isOpen, onClose }: ShareModalProps) => {
  const copyButton = useRef<HTMLButtonElement>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const handleLinkCopy = () => {
    navigator.clipboard.writeText(shortLink);
    copyButton.current!.title = "Link copiado";
    setLinkCopied(!linkCopied);
  };

  return (
    isOpen && (
      <section className="share-modal-container">
        <div className="share-modal-content">
          <div className="share-modal-header">
            <h1 className="text-amber-600">link da sala</h1>
            <div className="text-zinc-300 hover:text-zinc-600">
              <MdClose size={40} onClick={onClose} />
            </div>
          </div>
          <div className="share-modal-body">
            <p className="share-modal-link">
              {shortLink}
              <button
                className="share-modal-copy-button"
                type="button"
                ref={copyButton}
              >
                {linkCopied && <span className="share-link-copied" onMouseOver={() => setLinkCopied(!linkCopied)}>Link copiado</span>}
                <MdContentCopy size={20} onClick={handleLinkCopy} />
              </button>
            </p>
          </div>
          <div className="share-modal-footer mb-6">
            <BtnPrimary
              onClick={() => {
                handleLinkCopy();
                onClose();
              }}
              text="compartilhar"
              btnType="button"
            />
          </div>
        </div>
      </section>
    )
  );
};
