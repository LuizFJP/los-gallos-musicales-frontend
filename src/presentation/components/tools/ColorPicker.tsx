import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    onColorChange(newColor);
  };

  return (
    <input
      type="color"
      value={selectedColor}
      onChange={handleColorChange}
      style={{ marginRight: '10px' }}
    />
  );
};

export default ColorPicker;