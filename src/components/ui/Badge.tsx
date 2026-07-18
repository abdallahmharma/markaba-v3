interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const variants = {
    default: { backgroundColor: "#e0e0e0", color: "#333" },
    success: { backgroundColor: "#c8e6c9", color: "#2e7d32" },
    warning: { backgroundColor: "#fff9c4", color: "#f57f17" },
    error: { backgroundColor: "#ffcdd2", color: "#c62828" }
  };

  const style = variants[variant];

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "600",
        backgroundColor: style.backgroundColor,
        color: style.color
      }}
    >
      {children}
    </span>
  );
}