/**
 * Vehicle Trim Service - Sprint B3
 *
 * Firebase Firestore operations for vehicle trims.
 */

import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { VehicleTrim, CreateVehicleTrimInput, UpdateVehicleTrimInput } from "../types/vehicleTrim";

/**
 * Convert Firestore document to VehicleTrim type
 */
function snapshotToVehicleTrim(docSnap: any): VehicleTrim {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    generationId: data.generationId ?? "",
    trimName: data.trimName ?? "",
    slug: data.slug ?? "",
    description: data.description ?? "",
    engine: data.engine ?? "",
    transmission: data.transmission ?? "",
    drivetrain: data.drivetrain ?? "",
    horsepower: data.horsepower ?? 0,
    fuelType: data.fuelType ?? "",
    active: data.active ?? true,
    deletedAt: data.deletedAt?.toDate() ?? null,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
  };
}

/**
 * Generate slug from trim name
 */
function generateSlug(trimName: string): string {
  return trimName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Create a new vehicle trim
 */
export async function createVehicleTrim(trimData: CreateVehicleTrimInput): Promise<VehicleTrim> {
  const trimsRef = collection(db, "trims");
  
  const slug = generateSlug(trimData.trimName);
  
  // Check for duplicate slug
  const q = query(
    trimsRef,
    where("slug", "==", slug),
    limit(1)
  );
  
  const querySnap = await getDocs(q);
  if (!querySnap.empty) {
    throw new Error("Trim with this slug already exists");
  }
  
  const now = Timestamp.now();
  const docRef = await addDoc(trimsRef, {
    generationId: trimData.generationId,
    trimName: trimData.trimName,
    slug,
    description: trimData.description ?? "",
    engine: trimData.engine ?? "",
    transmission: trimData.transmission ?? "",
    drivetrain: trimData.drivetrain ?? "",
    horsepower: trimData.horsepower ?? 0,
    fuelType: trimData.fuelType ?? "",
    active: true,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  });
  
  // Return the created document
  const freshDoc = await getDoc(doc(db, "trims", docRef.id));
  if (!freshDoc.exists()) {
    throw new Error("Failed to retrieve created trim");
  }
  
  return snapshotToVehicleTrim(freshDoc);
}

/**
 * Update an existing vehicle trim (hard update)
 */
export async function updateVehicleTrim(trimId: string, updates: UpdateVehicleTrimInput): Promise<VehicleTrim> {
  const trimRef = doc(db, "trims", trimId);
  const trimSnap = await getDoc(trimRef);
  
  if (!trimSnap.exists()) {
    throw new Error("Vehicle trim not found");
  }
  
  const now = Timestamp.now();
  await updateDoc(trimRef, {
    ...updates,
    updatedAt: now,
  });
  
  const updatedDoc = await getDoc(trimRef);
  if (!updatedDoc.exists()) {
    throw new Error("Failed to retrieve updated trim");
  }
  
  return snapshotToVehicleTrim(updatedDoc);
}

/**
 * Delete a vehicle trim by ID (hard delete)
 */
export async function deleteVehicleTrimById(trimId: string): Promise<void> {
  const trimRef = doc(db, "trims", trimId);
  const trimSnap = await getDoc(trimRef);
  
  if (!trimSnap.exists()) {
    throw new Error("Vehicle trim not found");
  }
  
  await updateDoc(trimRef, {
    deletedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

/**
 * Get a vehicle trim by ID
 */
export async function getVehicleTrimById(trimId: string): Promise<VehicleTrim> {
  const trimRef = doc(db, "trims", trimId);
  const trimSnap = await getDoc(trimRef);
  
  if (!trimSnap.exists()) {
    throw new Error("Vehicle trim not found");
  }
  
  return snapshotToVehicleTrim(trimSnap);
}

/**
 * Get vehicle trims by ID array
 */
export async function getVehicleTrims(trimIds: string[]): Promise<VehicleTrim[]> {
  if (trimIds.length === 0) {
    return [];
  }
  
  const trimsRef = collection(db, "trims");
  const q = query(
    trimsRef,
    where("__name__", "in", trimIds.slice(0, 10)), // Firestore limit is 10
    orderBy("trimName")
  );
  
  const querySnap = await getDocs(q);
  return querySnap.docs.map(snapshotToVehicleTrim);
}

/**
 * Get vehicle trims by generation ID
 */
export async function getVehicleTrimsByGeneration(generationId: string): Promise<VehicleTrim[]> {
  const trimsRef = collection(db, "trims");
  const q = query(
    trimsRef,
    where("generationId", "==", generationId),
    where("active", "==", true),
    orderBy("trimName")
  );
  
  const querySnap = await getDocs(q);
  return querySnap.docs.map(snapshotToVehicleTrim);
}

/**
 * Get a vehicle trim by slug
 */
export async function getVehicleTrimBySlug(slug: string, generationId?: string): Promise<VehicleTrim> {
  const trimsRef = collection(db, "trims");
  
  let q;
  if (generationId) {
    q = query(
      trimsRef,
      where("slug", "==", slug),
      where("generationId", "==", generationId),
      limit(1)
    );
  } else {
    q = query(
      trimsRef,
      where("slug", "==", slug),
      limit(1)
    );
  }
  
  const querySnap = await getDocs(q);
  
  if (querySnap.empty) {
    throw new Error(`Vehicle trim with slug '${slug}' not found`);
  }
  
  return snapshotToVehicleTrim(querySnap.docs[0]);
}

/**
 * Check if a vehicle trim exists by ID
 */
export async function existsVehicleTrimById(trimId: string): Promise<boolean> {
  const trimRef = doc(db, "trims", trimId);
  const trimSnap = await getDoc(trimRef);
  return trimSnap.exists();
}

/**
 * Check if a vehicle trim slug exists within a generation
 */
export async function existsVehicleTrimSlug(slug: string, generationId?: string): Promise<boolean> {
  const trimsRef = collection(db, "trims");
  
  let q;
  if (generationId) {
    q = query(
      trimsRef,
      where("slug", "==", slug),
      where("generationId", "==", generationId),
      limit(1)
    );
  } else {
    q = query(
      trimsRef,
      where("slug", "==", slug),
      limit(1)
    );
  }
  
  const querySnap = await getDocs(q);
  return !querySnap.empty;
}