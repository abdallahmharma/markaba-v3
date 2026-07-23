/**
 * Favorite Entity Types
 * 
 * Sprint B8 — Favorites Data Layer
 */

export interface Favorite {
  id: string;
  userId: string;
  vehicleTrimId: string;
  createdAt: Date | null;
}

/**
 * Input type for creating a new favorite.
 */
export interface CreateFavoriteInput {
  userId: string;
  vehicleTrimId: string;
}

/**
 * Input type for updating an existing favorite.
 */
export interface UpdateFavoriteInput {
  userId?: string;
  vehicleTrimId?: string;
}