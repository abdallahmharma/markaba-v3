interface CardProps {
  children: React.ReactNode;
  title?: string;
}

export function Card({ children, title }: CardProps) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
      backgroundColor: "#fff"
    }}>
      {title && <h2 style={{ margin: "0 0 12px 0", fontSize: "18px" }}>{title}</h2>}
      {children}
    </div>
  );
}