import React from 'react';
import './tools.scss';
import eraserIcon from '../../../assets/eraser.png';
interface EraserButtonProps {
  eraserActivated: boolean;
  toggleEraser: () => void;
  artist: boolean;
}

const EraserButton: React.FC<EraserButtonProps> = ({ eraserActivated, toggleEraser, artist }) => {
  const handleEraserClick = () => {
      toggleEraser();
  };

  return (
    <button
      hidden={artist}
      onClick={handleEraserClick}
      className="eraser-Button"
      style={{
        backgroundImage:`url(${eraserIcon})`,
        backgroundSize: '70% 70%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width:"40px", 
        height:"40px",
        marginRight: 100,
        marginBottom: 10,
        backgroundColor: eraserActivated ? '#f88700' : '#ffe100',
      }}
    >
      
    </button>
  );
};

export default EraserButton;
