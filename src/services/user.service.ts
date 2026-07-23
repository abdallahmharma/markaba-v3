/**
 * User Service
 *
 * Firebase Firestore operations for users collection.
 * Follows FIRESTORE_SCHEMA.md exactly - only uses fields defined in the schema.
 */

import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import type { User, CreateUserInput, UpdateUserInput } from "../types/user";

/**
 * Firestore collection name for users.
 */
const USERS_COLLECTION = "users";

/**
 * Convert Firestore document to User object.
 */
function createUserFromDoc(docData: any, docId: string): User {
  return {
    id: docId,
    ...docData,
    createdAt: docData.createdAt?.toDate() ?? new Date(),
  } as User;
}

/**
 * Get a user by their email address.
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const q = query(collection(db, USERS_COLLECTION), where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  return createUserFromDoc(docSnap.data(), docSnap.id);
}

/**
 * Get users with optional filtering.
 */
export async function getUsers(filters?: {
  role?: string;
  country?: string;
  city?: string;
}): Promise<User[]> {
  let q = query(collection(db, USERS_COLLECTION));

  if (filters?.role) {
    q = query(q, where("role", "==", filters.role));
  }

  if (filters?.country) {
    q = query(q, where("country", "==", filters.country));
  }

  if (filters?.city) {
    q = query(q, where("city", "==", filters.city));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) =>
    createUserFromDoc(doc.data(), doc.id)
  );
}

/**
 * Get a single user by their ID.
 */
export async function getUserById(id: string): Promise<User | null> {
  const docRef = doc(db, USERS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return createUserFromDoc(docSnap.data(), docSnap.id);
}

/**
 * Check if a user exists by their ID.
 */
export async function existsUser(id: string): Promise<boolean> {
  const docRef = doc(db, USERS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

/**
 * Create a new user in Firestore.
 */
export async function createUser(input: CreateUserInput): Promise<string> {
  const docRef = await addDoc(collection(db, USERS_COLLECTION), {
    ...input,
    createdAt: new Date(),
  });
  return docRef.id;
}

/**
 * Update an existing user in Firestore.
 */
export async function updateUser(id: string, input: UpdateUserInput): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, id);
  await updateDoc(docRef, input as Record<string, string | null | Date>);
}

/**
 * Delete a user by their ID.
 */
export async function deleteUser(id: string): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, id);
  await deleteDoc(docRef);
}