/**
 * User types for the users data layer.
 *
 * Schema (FIRESTORE_SCHEMA.md - users collection):
 *   - id: string (document ID)
 *   - displayName: string
 *   - email: string
 *   - photoUrl: string | null
 *   - role: string ("user", "admin", "dealer")
 *   - country: string (e.g. "JO")
 *   - city: string (e.g. "Amman")
 *   - createdAt: timestamp (account creation time)
 */

/**
 * User entity matching the Firestore users collection schema.
 */
export interface User {
  /** Firestore document ID */
  id: string;
  /** User's display name */
  displayName: string;
  /** User's email address */
  email: string;
  /** Profile photo URL (nullable) */
  photoUrl: string | null;
  /** User role: "user", "admin", or "dealer" */
  role: string;
  /** Country code (e.g. "JO") */
  country: string;
  /** City name (e.g. "Amman") */
  city: string;
  /** Account creation timestamp */
  createdAt: Date;
}

/**
 * Input type for creating a new user.
 */
export interface CreateUserInput {
  displayName: string;
  email: string;
  photoUrl: string | null;
  role: string;
  country: string;
  city: string;
}

/**
 * Input type for updating an existing user.
 */
export interface UpdateUserInput {
  displayName?: string;
  email?: string;
  photoUrl?: string | null;
  role?: string;
  country?: string;
  city?: string;
}