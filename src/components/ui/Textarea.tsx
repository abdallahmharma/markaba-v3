interface TextareaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  name?: string;
  id?: string;
}

export function Textarea(props: TextareaProps) {
  return <textarea {...props} />;
}