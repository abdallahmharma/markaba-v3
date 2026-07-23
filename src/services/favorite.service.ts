/**
 * Favorite Service - Sprint B8
 *
 * Firebase Firestore operations for user vehicle favorites.
 */

import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Favorite, CreateFavoriteInput } from "../types/favorite";

/**
 * Collection path constant
 */
const FAVORITES_COLLECTION = "favorites";

/**
 * Helper to map Firestore document to Favorite type.
 */
function snapshotToFavorites(docSnap: import("firebase/firestore").DocumentSnapshot): Favorite {
  const data = docSnap.data()!;
  return {
    id: docSnap.id,
    userId: data.userId ?? "",
    vehicleTrimId: data.vehicleTrimId ?? "",
    createdAt: data.createdAt?.toDate() ?? new Date(),
  };
}

/**
 * Validate CreateFavoriteInput.
 * @param data - Input to validate
 * @throws Error if validation fails
 */
function validateCreateInput(data: CreateFavoriteInput): void {
  if (!data.userId || typeof data.userId !== "string") {
    throw new Error("userId is required and must be a string");
  }
  if (!data.vehicleTrimId || typeof data.vehicleTrimId !== "string") {
    throw new Error("vehicleTrimId is required and must be a string");
  }
}

/**
 * Create a new favorite.
 * @param data - Favorite input data (userId and vehicleTrimId required)
 * @returns The ID of the created favorite document
 * @throws Error if userId or vehicleTrimId is missing
 */
export async function createFavorite(data: CreateFavoriteInput): Promise<string> {
  validateCreateInput(data);

  // Check for duplicate: same user + same trim
  const exists = await existsFavorite(data.userId, data.vehicleTrimId);
  if (exists) {
    throw new Error("Favorite already exists for this user and vehicle trim");
  }

  const now = Timestamp.fromDate(new Date());
  const docRef = await addDoc(collection(db, FAVORITES_COLLECTION), {
    userId: data.userId,
    vehicleTrimId: data.vehicleTrimId,
    createdAt: now,
  });
  return docRef.id;
}

/**
 * Delete a favorite by its ID.
 * @param favoriteId - The Firestore document ID of the favorite to delete
 */
export async function deleteFavorite(favoriteId: string): Promise<void> {
  const docRef = doc(db, FAVORITES_COLLECTION, favoriteId);
  await deleteDoc(docRef);
}

/**
 * Get a single favorite by its document ID.
 * @param favoriteId - The Firestore document ID
 * @returns Favorite document, or null if not found
 */
export async function getFavoriteById(favoriteId: string): Promise<Favorite | null> {
  const docRef = doc(db, FAVORITES_COLLECTION, favoriteId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return snapshotToFavorites(docSnap);
}

/**
 * Get all favorites (unfiltered).
 * @returns Array of all favorites ordered by creation date (newest first)
 */
export async function getFavorites(): Promise<Favorite[]> {
  const q = query(
    collection(db, FAVORITES_COLLECTION),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(snapshotToFavorites);
}

/**
 * Get all favorites by user ID.
 * @param userId - The user's document ID
 * @returns Array of favorites for the given user, ordered by creation date (newest first)
 */
export async function getFavoritesByUser(userId: string): Promise<Favorite[]> {
  if (!userId || typeof userId !== "string") {
    throw new Error("userId is required and must be a string");
  }

  const q = query(
    collection(db, FAVORITES_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(snapshotToFavorites);
}

/**
 * Check if a favorite exists for a given user and vehicle trim.
 * @param userId - The user's document ID
 * @param vehicleTrimId - The vehicle trim document ID
 * @returns true if at least one matching favorite exists
 */
export async function existsFavorite(userId: string, vehicleTrimId: string): Promise<boolean> {
  if (!userId || typeof userId !== "string") {
    throw new Error("userId is required and must be a string");
  }
  if (!vehicleTrimId || typeof vehicleTrimId !== "string") {
    throw new Error("vehicleTrimId is required and must be a string");
  }

  const q = query(
    collection(db, FAVORITES_COLLECTION),
    where("userId", "==", userId),
    where("vehicleTrimId", "==", vehicleTrimId),
    limit(1)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
}