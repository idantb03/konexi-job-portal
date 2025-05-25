import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, name, required = false, ...props }) => {
  return (
    <div className="sm:col-span-3">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          name={name}
          id={name}
          required={required}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border text-black"
          {...props}
        />
      </div>
    </div>
  );
};
