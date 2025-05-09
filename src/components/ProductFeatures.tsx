import { FC } from 'react';
import { JSX } from 'react/jsx-runtime';

interface Feature {
  icon: JSX.Element;
  text: string;
}

interface ProductFeaturesProps {
  features: Feature[];
}

export const ProductFeatures: FC<ProductFeaturesProps> = ({ features }) => {
  return (
    <ul className="space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex">
          <span className="mr-2 text-gray-600">{feature.icon}</span>
          <span>{feature.text}</span>
        </li>
      ))}
    </ul>
  );
};
