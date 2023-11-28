import React from 'react';

interface SizeSliderProps {
  brushSize: number;
  setBrushSize: React.Dispatch<React.SetStateAction<number>>;
  artist: boolean;
}

const SizeSlider: React.FC<SizeSliderProps> = ({ brushSize, setBrushSize, artist }) => {
  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setBrushSize(newSize);
  };

  return (
    <div hidden={artist} style={{ marginTop: '10px' }}>
      <label htmlFor="sizeSlider">Brush Size:</label>
      <input
        type="range"
        id="sizeSlider"
        min="1"
        max="20"
        value={brushSize}
        onChange={handleSizeChange}
      />
      <span>{brushSize}</span>
    </div>
  );
};

export default SizeSlider;
