import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  artist: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange, artist }) => {
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    onColorChange(newColor);
  };

  return (
    <input
      hidden={artist}
      type="color"
      value={selectedColor}
      onChange={handleColorChange}
      style={{ marginRight: '10px' }}
    />
  );
};

export default ColorPicker;