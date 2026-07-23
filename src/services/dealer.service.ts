/**
 * Dealer Service
 *
 * Firebase Firestore operations for dealers.
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
import type { Dealer, CreateDealerInput, UpdateDealerInput } from "../types/dealer";

/**
 * Get all dealers
 */
export async function getDealers(): Promise<Dealer[]> {
  const querySnapshot = await getDocs(collection(db, "dealers"));
  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  } as Dealer));
}

/**
 * Get single dealer by ID
 */
export async function getDealerById(id: string): Promise<Dealer | null> {
  const docRef = doc(db, "dealers", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Dealer;
}

/**
 * Create a new dealer
 */
export async function createDealer(data: CreateDealerInput): Promise<string> {
  const docRef = await addDoc(collection(db, "dealers"), data);
  return docRef.id;
}

/**
 * Update an existing dealer
 */
export async function updateDealer(id: string, data: UpdateDealerInput): Promise<void> {
  const docRef = doc(db, "dealers", id);
  await updateDoc(docRef, data as Partial<Dealer>);
}

/**
 * Delete a dealer
 */
export async function deleteDealer(id: string): Promise<void> {
  const docRef = doc(db, "dealers", id);
  await deleteDoc(docRef);
}

/**
 * Get dealers by brand (slug)
 */
export async function getDealersByBrand(brand: string): Promise<Dealer[]> {
  const q = query(collection(db, "dealers"), where("brands", "array-contains", brand));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  } as Dealer));
}

/**
 * Get dealers by city
 */
export async function getDealersByCity(city: string): Promise<Dealer[]> {
  const q = query(collection(db, "dealers"), where("city", "==", city));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  } as Dealer));
}

/**
 * Check if a dealer exists by ID
 */
export async function existsDealer(id: string): Promise<boolean> {
  const docRef = doc(db, "dealers", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}