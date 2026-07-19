import React from 'react';

export interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  name,
  id,
}: InputProps): React.ReactElement {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      name={name}
      id={id}
    />
  );
}