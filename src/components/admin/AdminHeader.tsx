import React from "react";
import { useAdmin } from "../../hooks/useAdmin";

/**
 * AdminHeader renders:
 *   - Page Title (placeholder)
 *   - Admin Name
 *   - Sign Out placeholder
 */
export function AdminHeader(): React.ReactElement {
  const { currentAdmin, signOut } = useAdmin();

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#111827",
        }}
      >
        Admin Panel
      </h1>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
          }}
        >
          {currentAdmin?.displayName ?? currentAdmin?.email ?? "Admin"}
        </span>
        <button
          onClick={signOut}
          style={{
            padding: "0.375rem 0.75rem",
            fontSize: "0.875rem",
            backgroundColor: "#ef4444",
            color: "#ffffff",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#dc2626";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = "#ef4444";
          }}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}