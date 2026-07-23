import { useContext } from "react";
import { AdminContext } from "../contexts/AdminContext";

/**
 * Hook to access the AdminContext state and actions.
 * Returns the context value directly.
 */
export function useAdmin() {
  const context = useContext(AdminContext);
  return context;
}