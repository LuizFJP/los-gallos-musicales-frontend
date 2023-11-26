import React, { useContext, useEffect, useRef, useState } from "react";
import { Player } from "../../../../domain/entities/room/room";
import Avatar from "../../../../assets/avatars/avatar_01.png";
import { ActionModal } from "../../modal/action-modal/action-modal";
import { MdReport } from "react-icons/md";
import "./player-list.scss";
import { useSearchParams } from "react-router-dom";

export type PlayerListProps = {
  players: Player[];
};

export const PlayerList = ({ players }: PlayerListProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const roomName = searchParams.get("name");

  const handleOpenModal = (player: Player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPlayer(null);
    setIsModalOpen(false);
  };

  return (
    <section className="player-list-container">
      {selectedPlayer && (
        <div className="action-modal-overlay absolute">
          <ActionModal
            isOpen={isModalOpen}
            title={`Denunciar ${selectedPlayer.username}`}
            description={`Deseja denunciar o jogador ${selectedPlayer.username} por comportamento inadequado?`}
            confirmText="Denunciar"
            hasCancel
            cancelText="Cancelar"
            onConfirm={(result: boolean) => {
              if (result) {
                const reportMessage = {
                  sender: "Sistema",
                  text: `${selectedPlayer.username} denunciou ${selectedPlayer.username}`,
                };

                // socket.emit("answer-chat-message", roomName, reportMessage);
                // console.log(players)
                // selectedPlayer.socket.emit("answer-chat-message", roomName, reportMessage);
                // console.log("Reported:", reportMessage);
                handleCloseModal();
              }
            }}
            onCancel={handleCloseModal}
            icon={MdReport} 
            iconColor="#ff0000"
          />
        </div>
      )}
      <ul className="player-list flex flex-col gap-4 overflow-y-scroll rounded-lg p-6">
        {players.map((player, index) => (
          <li
            key={index}
            className="flex items-center justify-start gap-4 hover:bg-gray-300 p-2 rounded-lg hover:text-gray-950 text-sm lg:text-lg text-gray-50"
          >
            <div className="avatar-container">
              <img
                src={Avatar}
                alt=""
                className="selected-avatar rounded-full object-cover h-24 w-24 border-solid border-4 border-gray-50"
              />
            </div>
            <div className="player-info flex flex-col gap-2">
              <span>{player.username}</span>
              <span>{player.score} pts</span>
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleOpenModal(player)}
              >
                Denunciar
              </button>
            </div>
          </li>
        ))}
      </ul>

    </section>
  );
};
