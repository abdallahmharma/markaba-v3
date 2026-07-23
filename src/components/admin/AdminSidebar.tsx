import React from "react";
import type { AdminPermission } from "../../types/admin";

/**
 * Navigation menu item definition.
 */
interface MenuItem {
  label: string;
  icon: string;
  requiredPermission: AdminPermission | null;
}

/**
 * Static navigation menu items for the admin panel.
 * No routing, no Firestore.
 */
const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", icon: "📊", requiredPermission: null },
  { label: "Manufacturers", icon: "🏭", requiredPermission: "manufacturers:read" },
  { label: "Models", icon: "🚗", requiredPermission: "models:read" },
  { label: "Generations", icon: "🔄", requiredPermission: "models:read" },
  { label: "Trims", icon: "⚙️", requiredPermission: "models:read" },
  { label: "Vehicles", icon: "🚘", requiredPermission: "vehicles:read" },
  { label: "Reviews", icon: "⭐", requiredPermission: "reviews:read" },
  { label: "Users", icon: "👥", requiredPermission: "users:read" },
  { label: "Dealers", icon: "🏪", requiredPermission: "dealers:read" },
  { label: "News", icon: "📰", requiredPermission: "news:read" },
  { label: "Settings", icon: "⚙️", requiredPermission: "settings:read" },
];

/**
 * AdminSidebar renders static navigation only.
 * No routing, no Firestore.
 */
export function AdminSidebar(): React.ReactElement {
  return (
    <aside
      style={{
        width: "260px",
        backgroundColor: "#1f2937",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        padding: "1rem 0",
      }}
    >
      <div
        style={{
          padding: "0 1.5rem",
          marginBottom: "1.5rem",
          fontSize: "1.25rem",
          fontWeight: 700,
        }}
      >
        Markaba Admin
      </div>
      <nav style={{ flex: 1 }}>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {MENU_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 1.5rem",
                  color: "#d1d5db",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = "#374151";
                  (e.target as HTMLElement).style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = "transparent";
                  (e.target as HTMLElement).style.color = "#d1d5db";
                }}
              >
                <span style={{ fontSize: "1.125rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}