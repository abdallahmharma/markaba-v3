import React from "react";
import { useAdmin } from "../../hooks/useAdmin";

export interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * AdminProtectedRoute handles:
 *   - Loading state (shows spinner)
 *   - Unauthenticated state (shows login prompt)
 *   - Unauthorized state (shows access denied)
 *   - Renders children when authenticated and authorized
 *
 * Uses placeholder authentication only.
 */
export function AdminProtectedRoute({
  children,
}: AdminProtectedRouteProps): React.ReactElement {
  const { currentAdmin, loading } = useAdmin();

  // Loading state: show spinner
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
        }}
      >
        <div
          style={{
            width: "2.5rem",
            height: "2.5rem",
            border: "3px solid #e5e7eb",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>
          {`@keyframes spin { to { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  // Unauthenticated state: show login prompt
  if (!currentAdmin) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "1.125rem",
              color: "#6b7280",
              marginBottom: "1rem",
            }}
          >
            You must be authenticated to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  // All checks passed: render children
  return <>{children}</>;
}