/**
 * Admin types for the Admin Foundation infrastructure.
 */

export type AdminPermission =
  | "manufacturers:read"
  | "manufacturers:write"
  | "models:read"
  | "models:write"
  | "vehicles:read"
  | "vehicles:write"
  | "reviews:read"
  | "reviews:write"
  | "users:read"
  | "users:write"
  | "dealers:read"
  | "dealers:write"
  | "news:read"
  | "news:write"
  | "settings:read"
  | "settings:write";

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  photoUrl: string | null;
  permissions: AdminPermission[];
}

export interface AdminContextState {
  currentAdmin: AdminUser | null;
  loading: boolean;
  permissions: AdminPermission[];
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}