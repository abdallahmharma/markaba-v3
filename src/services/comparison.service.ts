/**
 * Comparison Service - Sprint B9
 *
 * Firebase Firestore operations for user vehicle comparisons.
 */

import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  limit,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Comparison, CreateComparisonInput } from "../types/comparison";
import { MAX_COMPARISON_VEHICLES, MIN_COMPARISON_VEHICLES } from "../types/comparison";

/**
 * Collection path constant
 */
const COMPARISONS_COLLECTION = "comparisons";

/**
 * Helper to map Firestore document to Comparison type.
 */
function snapshotToComparison(docSnap: import("firebase/firestore").DocumentSnapshot): Comparison {
  const data = docSnap.data()!;
  return {
    id: docSnap.id,
    userId: data.userId ?? "",
    vehicleIds: data.vehicleIds ?? [],
    createdAt: data.createdAt?.toDate() ?? new Date(),
  };
}

/**
 * Validate CreateComparisonInput.
 * @param data - Input to validate
 * @throws Error if validation fails
 */
function validateCreateInput(data: CreateComparisonInput): void {
  if (!data.userId || typeof data.userId !== "string") {
    throw new Error("userId is required and must be a string");
  }
  if (!data.vehicleIds || !Array.isArray(data.vehicleIds)) {
    throw new Error("vehicleIds is required and must be an array");
  }
  if (data.vehicleIds.length < MIN_COMPARISON_VEHICLES) {
    throw new Error(`vehicleIds must contain at least ${MIN_COMPARISON_VEHICLES} items`);
  }
  if (data.vehicleIds.length > MAX_COMPARISON_VEHICLES) {
    throw new Error(`vehicleIds must contain at most ${MAX_COMPARISON_VEHICLES} items`);
  }

  // Check for duplicate vehicle IDs within the array
  const uniqueVehicleIds = new Set(data.vehicleIds);
  if (uniqueVehicleIds.size !== data.vehicleIds.length) {
    throw new Error("vehicleIds must not contain duplicate values");
  }
}

/**
 * Create a new comparison.
 * @param data - Comparison input data (userId and vehicleIds required)
 * @returns The ID of the created comparison document
 * @throws Error if validation fails
 */
export async function createComparison(data: CreateComparisonInput): Promise<string> {
  validateCreateInput(data);

  const now = Timestamp.fromDate(new Date());
  const docRef = await addDoc(collection(db, COMPARISONS_COLLECTION), {
    userId: data.userId,
    vehicleIds: data.vehicleIds,
    createdAt: now,
  });
  return docRef.id;
}

/**
 * Update an existing comparison's vehicle IDs.
 * @param comparisonId - The Firestore document ID of the comparison to update
 * @param vehicleIds - New array of vehicle trim IDs
 * @throws Error if validation fails
 */
export async function updateComparison(
  comparisonId: string,
  vehicleIds: string[]
): Promise<void> {
  if (!comparisonId || typeof comparisonId !== "string") {
    throw new Error("comparisonId is required and must be a string");
  }

  // Validate the new vehicleIds
  if (!vehicleIds || !Array.isArray(vehicleIds)) {
    throw new Error("vehicleIds is required and must be an array");
  }
  if (vehicleIds.length < MIN_COMPARISON_VEHICLES) {
    throw new Error(`vehicleIds must contain at least ${MIN_COMPARISON_VEHICLES} items`);
  }
  if (vehicleIds.length > MAX_COMPARISON_VEHICLES) {
    throw new Error(`vehicleIds must contain at most ${MAX_COMPARISON_VEHICLES} items`);
  }

  // Check for duplicate vehicle IDs within the array
  const uniqueVehicleIds = new Set(vehicleIds);
  if (uniqueVehicleIds.size !== vehicleIds.length) {
    throw new Error("vehicleIds must not contain duplicate values");
  }

  const docRef = doc(db, COMPARISONS_COLLECTION, comparisonId);
  await updateDoc(docRef, {
    vehicleIds,
  });
}

/**
 * Delete a comparison by its ID.
 * @param comparisonId - The Firestore document ID of the comparison to delete
 */
export async function deleteComparison(comparisonId: string): Promise<void> {
  const docRef = doc(db, COMPARISONS_COLLECTION, comparisonId);
  await deleteDoc(docRef);
}

/**
 * Get a single comparison by its document ID.
 * @param comparisonId - The Firestore document ID
 * @returns Comparison document, or null if not found
 */
export async function getComparisonById(comparisonId: string): Promise<Comparison | null> {
  const docRef = doc(db, COMPARISONS_COLLECTION, comparisonId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return snapshotToComparison(docSnap);
}

/**
 * Get all comparisons (unfiltered).
 * @returns Array of all comparisons ordered by creation date (newest first)
 */
export async function getComparisons(): Promise<Comparison[]> {
  const q = query(
    collection(db, COMPARISONS_COLLECTION),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(snapshotToComparison);
}

/**
 * Get all comparisons by user ID.
 * @param userId - The user's document ID
 * @returns Array of comparisons for the given user, ordered by creation date (newest first)
 */
export async function getComparisonsByUser(userId: string): Promise<Comparison[]> {
  if (!userId || typeof userId !== "string") {
    throw new Error("userId is required and must be a string");
  }

  const q = query(
    collection(db, COMPARISONS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(snapshotToComparison);
}

/**
 * Check if a comparison exists for a given user.
 * @param userId - The user's document ID
 * @returns true if at least one comparison exists for the user
 */
export async function existsComparison(userId: string): Promise<boolean> {
  if (!userId || typeof userId !== "string") {
    throw new Error("userId is required and must be a string");
  }

  const q = query(
    collection(db, COMPARISONS_COLLECTION),
    where("userId", "==", userId),
    limit(1)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
}