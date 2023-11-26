import { MdClose } from "react-icons/md";
import { BtnSecondary } from "../../button/secondary/btn-secondary";
import { BtnPrimary } from "../../button/primary/btn-primary";

import "./action-modal.scss";
import { ElementType } from "react";

interface ActionModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  hasCancel: boolean;
  confirmText: string;
  cancelText?: string;
  title: string;
  description: string;
  isOpen: boolean;
  icon: ElementType;
  iconColor: string;
}

export const ActionModal = (props: ActionModalProps) => {

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
                }}
                color={'#000'}
              />
            </div>
          </section>
          <section className="action-modal-description-container">
            {props.icon && <props.icon size={96} color={props.iconColor} />}
            <p>{props.description}</p>
          </section>
          <section className="action-modal-button-container">
          {props.hasCancel && (
              <BtnSecondary
                btnType="button"
                text={props.cancelText as string}
                onClick={() => {
                  props.onCancel();
                }}
              />
            )}
            <BtnPrimary
              btnType="button"
              text={props.confirmText}
              onClick={() => {
                props.onConfirm();
              }}
            />

          </section>
        </div>
    )
  );
};
export default ActionModal;
