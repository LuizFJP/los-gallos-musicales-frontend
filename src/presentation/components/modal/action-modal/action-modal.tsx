import { MdClose } from "react-icons/md";
import { BtnSecondary } from "../../button/secondary/btn-secondary";
import { BtnPrimary } from "../../button/primary/btn-primary";

import "./action-modal.scss";

interface ActionModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  hasCancel: boolean;
  confirmText: string;
  cancelText?: string;
  title: string;
  description: string;
  isOpen: boolean;
}

export const ActionModal = (props: ActionModalProps) => {
  const handleOpenModal = () => {
    props.isOpen = !props.isOpen;
  };

  return (
    props.isOpen && (
        <div className="action-modal-container">
          <section className="action-modal-header">
            <div className="action-modal-header-title">
            <h1>{props.title}</h1>
            </div>
            <div className="action-modal-header-close-button-container">
              <MdClose
                size={32}
                onClick={() => {
                  props.onCancel();
                  handleOpenModal();
                }}
              />
            </div>
          </section>
          <section className="action-modal-description-container">
            <p>{props.description}</p>
          </section>
          <section className="action-modal-button-container">
            <BtnPrimary
              btnType="button"
              text={props.confirmText}
              onClick={() => {
                props.onConfirm();
                handleOpenModal();
              }}
            />
            {props.hasCancel && (
              <BtnSecondary
                btnType="button"
                text={props.cancelText as string}
                onClick={() => {
                  props.onCancel();
                  handleOpenModal();
                }}
              />
            )}
          </section>
        </div>
    )
  );
};
export default ActionModal;
