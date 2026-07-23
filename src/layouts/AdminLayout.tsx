import React, { type ReactNode } from "react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";

export interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * AdminLayout provides the admin panel shell with Header, Sidebar, and Main Content.
 */
export function AdminLayout({ children }: AdminLayoutProps): React.ReactElement {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AdminHeader />
        <main style={{ flex: 1, padding: "2rem", paddingTop: "1rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}