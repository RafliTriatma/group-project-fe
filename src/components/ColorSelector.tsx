import { FC } from 'react';

interface ColorOption {
  name: string;
  bgClass: string;
}

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export const ColorSelector: FC<ColorSelectorProps> = ({ colors, selectedColor, onSelectColor }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button 
            key={color.name}
            className={`w-8 h-8 rounded-full ${color.bgClass} ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
            onClick={() => onSelectColor(color.name)}
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
    </div>
  );
};
