/**
 * Manufacturer Service - Sprint 3
 * 
 * Firebase Firestore operations for manufacturers.
 */

import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import type { Manufacturer } from "../types/manufacturer";

/**
 * Get all manufacturers
 */
export async function getManufacturers(): Promise<Manufacturer[]> {
  const querySnapshot = await getDocs(collection(db, "manufacturers"));
  return querySnapshot.docs.map(doc => ({
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