interface SelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export function Select({
  value,
  onChange,
  children,
  disabled = false,
  name,
  id,
}: SelectProps) {
  return (
    <select value={value} onChange={onChange} disabled={disabled} name={name} id={id}>
      {children}
    </select>
  );
}