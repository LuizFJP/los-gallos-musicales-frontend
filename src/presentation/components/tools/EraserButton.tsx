import React from 'react';

interface EraserButtonProps {
  eraserActivated: boolean;
  toggleEraser: () => void;
}

const EraserButton: React.FC<EraserButtonProps> = ({ eraserActivated, toggleEraser }) => {
  const handleEraserClick = () => {
      toggleEraser();
  };

  return (
    <button
      onClick={handleEraserClick}
      className="toolButton"
      style={{
        marginRight: 100,
        width: 35,
        height: 35,
        backgroundColor: eraserActivated ? 'blue' : 'cyan',
      }}
    >
      Eraser
    </button>
  );
};

export default EraserButton;
