interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

export function Spinner({ size = "md" }: SpinnerProps) {
  void size;
  return (
    <div>Loading...</div>
  );
}