import { FC } from 'react';

interface ShippingOption {
  method: string;
  time: string;
}

interface ShippingInfoProps {
  options: ShippingOption[];
}

export const ShippingInfo: FC<ShippingInfoProps> = ({ options }) => {
  return (
    <ul className="space-y-2 text-gray-700">
      {options.map((option, index) => (
        <li key={index}>{option.method}: {option.time}</li>
      ))}
    </ul>
  );
};