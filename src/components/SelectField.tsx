import { FC, ReactNode } from 'react';

interface SelectFieldProps {
  label: string;
  children: ReactNode;
}

export const SelectField: FC<SelectFieldProps> = ({ label, children }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {children}
      </div>
    </div>
  );
};
