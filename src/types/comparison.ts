/**
 * Comparison types for the comparisons data layer.
 *
 * Schema (FIRESTORE_SCHEMA.md - comparisons collection):
 *   - id: string (document ID)
 *   - userId: string (reference to users doc ID)
 *   - vehicleIds: string[] (list of vehicleTrimId values, max 5)
 *   - createdAt: timestamp (comparison creation time)
 */

/**
 * Maximum number of vehicles allowed in a comparison.
 */
export const MAX_COMPARISON_VEHICLES = 5;

/**
 * Minimum number of vehicles required in a comparison.
 */
export const MIN_COMPARISON_VEHICLES = 2;

/**
 * Comparison entity matching the Firestore comparisons collection schema.
 */
export interface Comparison {
  /** Firestore document ID */
  id: string;
  /** User ID who owns this comparison */
  userId: string;
  /** Array of vehicle trim IDs included in the comparison */
  vehicleIds: string[];
  /** Creation timestamp */
  createdAt: Date;
}

/**
 * Input type for creating a new comparison.
 */
export interface CreateComparisonInput {
  userId: string;
  vehicleIds: string[];
}