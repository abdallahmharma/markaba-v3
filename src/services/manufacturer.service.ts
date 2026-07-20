/**
 * Manufacturer Service - Sprint 3
 *
 * Firebase Firestore operations for manufacturers.
 */

import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Manufacturer } from "../types/manufacturer";

/**
 * Get all manufacturers
 */
export async function getManufacturers(): Promise<Manufacturer[]> {
  const querySnapshot = await getDocs(collection(db, "manufacturers"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() ?? null,
  } as Manufacturer));
}

/**
 * Get single manufacturer by ID
 */
export async function getManufacturer(id: string): Promise<Manufacturer | null> {
  const docRef = doc(db, "manufacturers", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate() ?? null,
  } as Manufacturer;
}

/**
 * Create a new manufacturer
 */
export async function createManufacturer(data: Omit<Manufacturer, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, "manufacturers"), {
    ...data,
    createdAt: new Date(),
  });
  return docRef.id;
}

/**
 * Update an existing manufacturer
 */
export async function updateManufacturer(id: string, data: Partial<Manufacturer>): Promise<void> {
  const docRef = doc(db, "manufacturers", id);
  await updateDoc(docRef, data);
}

/**
 * Delete a manufacturer
 */
export async function deleteManufacturer(id: string): Promise<void> {
  const docRef = doc(db, "manufacturers", id);
  await deleteDoc(docRef);
}