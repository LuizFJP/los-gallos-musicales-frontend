import { MdClose, MdDone } from "react-icons/md";
import { Avatar } from "../../../../domain/entities/avatar/avatar";
import { useState } from "react";
import "./avatar-modal.scss";

export type AvatarModalProps = {
  isOpen: boolean;
  avatarList: Avatar[];
  onAvatarSelect: (selectedAvatar: string) => void;
  onCloseModal: () => void;
};

export const AvatarModal = (props: AvatarModalProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>();


  const handleSelectedAvatar = (image: HTMLImageElement) => {
    const avatars = document.querySelectorAll(".avatar");
    avatars.forEach((avatar) => {
      avatar.classList.remove("selected-avatar");
      image.classList.add("selected-avatar");
    });
  }

  return (
    props.isOpen && (
      <section className="avatar-modal-container z-10 w-full h-full absolute flex items-center justify-center">
        <div className="avatar-modal bg-gray-300 w-[648px] h-[474px] rounded-xl p-4 relative flex items-center justify-center flex-col">
          <header className="w-full">
            <div className="text-gray-950 w-full flex justify-end p-2 cursor-pointer" onClick={() => {
              props.onCloseModal();
            }}>
              <MdClose size={32} />
            </div>
            <div className="avatar-header flex items-center justify-center text-gray-900 text-lg xl:text-xl p-4 mb-2">
              <span className="border-4 border-solid border-gray-950 rounded-lg p-4 uppercase absolute -top-8 bg-gray-50 font-bold">
                Escolha seu avatar
              </span>
            </div>
          </header>
          <div className="w-96 h-72 mt-4 mb-4">
            <ul className="avatar-list flex flex-1 flex-wrap justify-center items-center overflow-y-scroll avatar-list gap-2 p-2">
              {props.avatarList &&
                props.avatarList.map((avatar: Avatar, index: number) => (
                  <li key={index} className="avatar-container">
                    <img
                      src={`data:${avatar.mimetype};base64,${avatar.base64}`}
                      alt=""
                      className={`avatar rounded-full object-cover h-28 w-28 borer-solid border-4 border-gray-50 cursor-pointer hover:border-blue-600`}
                      onClick={(event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
                        const element = event.target as HTMLImageElement;
                        setSelectedAvatar(element.src);
                        handleSelectedAvatar(element);
                      } }
                    />
                  </li>
                ))}
            </ul>
          </div>
          <footer>
            <button className="bg-gray-700 text-gray-50 uppercase border-2 border-solid border-gray-200 py-3 px-6 rounded-lg flex items-center justify-center gap-3" onClick={() => {
              props.onAvatarSelect(selectedAvatar as string);
            }}>
              Confirmar <MdDone size={24} />{" "}
            </button>
          </footer>
        </div>
      </section>
    )
  );
};
