import { createContext, useCallback, useMemo, useState } from "react";
import type { AdminContextState, AdminUser, AdminPermission } from "../types/admin";

/**
 * Initial context state with loading=true (unauthenticated by default).
 */
const initialState: AdminContextState = {
  currentAdmin: null,
  loading: true,
  permissions: [],
  signOut: async () => {},
  refresh: async () => {},
};

/**
 * AdminContext provides admin state and actions.
 * Responsible ONLY for:
 *   - currentAdmin
 *   - loading
 *   - permissions
 *   - signOut()
 *   - refresh()
 *
 * No Firestore, no Auth implementation, no business logic.
 */
export const AdminContext = createContext<AdminContextState>(initialState);

export interface AdminProviderProps {
  children: React.ReactNode;
}

/**
 * AdminProvider supplies admin state to the app.
 */
export function AdminProvider({ children }: AdminProviderProps): React.ReactElement {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Sign out placeholder.
   */
  const signOut = useCallback(async (): Promise<void> => {
    setCurrentAdmin(null);
    setLoading(false);
  }, []);

  /**
   * Refresh placeholder.
   */
  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    // Placeholder: In production, this would re-fetch admin state from auth/firestore.
    setCurrentAdmin(null);
    setLoading(false);
  }, []);

  /**
   * Compute permissions array from currentAdmin.
   */
  const permissions: AdminPermission[] = useMemo(
    () => currentAdmin?.permissions ?? [],
    [currentAdmin]
  );

  const value: AdminContextState = useMemo(
    () => ({
      currentAdmin,
      loading,
      permissions,
      signOut,
      refresh,
    }),
    [currentAdmin, loading, permissions, signOut, refresh]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}