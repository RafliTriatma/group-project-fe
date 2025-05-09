import { FC } from 'react';
import { MinusIcon, PlusIcon } from './icons';

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export const QuantitySelector: FC<QuantitySelectorProps> = ({ quantity, onDecrease, onIncrease }) => {
  return (
    <div className="flex border border-gray-300 rounded-md">
      <button 
        className="px-3 py-2 bg-white text-gray-600"
        onClick={onDecrease}
        aria-label="Decrease quantity"
      >
        —
      </button>
      <div className="px-4 py-2 border-l border-r border-gray-300">
        {quantity}
      </div>
      <button 
        className="px-3 py-2 bg-white text-gray-600"
        onClick={onIncrease}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};
