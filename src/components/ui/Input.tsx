interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "search";
  name?: string;
  disabled?: boolean;
  required?: boolean;
}

export function Input({ value, onChange, placeholder, type = "text", name, disabled, required }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      name={name}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        padding: "8px 12px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "14px"
      }}
    />
  );
}