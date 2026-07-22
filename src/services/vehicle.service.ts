/**
 * Vehicle Service - Sprint B4
 *
 * Firebase Firestore operations for vehicles.
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
} from "firebase/firestore";
import type { Vehicle, CreateVehicleInput } from "../types/vehicle";
import { db } from "../firebase";

/**
 * Collection path constant
 */
const VEHICLE_COLLECTION = "vehicles";

/**
 * Create a new vehicle.
 * Returns the vehicle ID.
 */
export async function createVehicle(data: CreateVehicleInput): Promise<string> {
  const now = new Date();
  const docRef = await addDoc(collection(db, VEHICLE_COLLECTION), {
    manufacturerId: data.manufacturerId,
    modelId: data.modelId,
    generationId: data.generationId ?? null,
    trimId: data.trimId ?? null,
    modelYear: data.modelYear,
    active: true,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

/**
 * Update an existing vehicle.
 */
export async function updateVehicle(vehicleId: string, data: Partial<CreateVehicleInput>): Promise<void> {
  const docRef = doc(db, VEHICLE_COLLECTION, vehicleId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
}

/**
 * Soft delete a vehicle.
 */
export async function deleteVehicle(vehicleId: string): Promise<void> {
  const docRef = doc(db, VEHICLE_COLLECTION, vehicleId);
  await updateDoc(docRef, {
    active: false,
    updatedAt: new Date(),
  });
}

/**
 * Get a single vehicle by ID.
 */
export async function getVehicleById(vehicleId: string): Promise<Vehicle | null> {
  const docRef = doc(db, VEHICLE_COLLECTION, vehicleId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      manufacturerId: data.manufacturerId,
      modelId: data.modelId,
      generationId: data.generationId ?? null,
      trimId: data.trimId ?? null,
      modelYear: data.modelYear,
      active: data.active ?? true,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate() ?? new Date(),
    } as Vehicle;
  }
  return null;
}

/**
 * Get vehicles filtered by optional criteria.
 * All parameters are optional filters (AND logic).
 */
export async function getVehicles(params?: {
  manufacturerId?: string;
  modelId?: string;
  generationId?: string;
  trimId?: string;
  activeOnly?: boolean;
}): Promise<Vehicle[]> {
  let q = query(collection(db, VEHICLE_COLLECTION));

  const filters = [
    { field: "manufacturerId", value: params?.manufacturerId },
    { field: "modelId", value: params?.modelId },
    { field: "generationId", value: params?.generationId },
    { field: "trimId", value: params?.trimId },
  ];

  for (const filter of filters) {
    if (filter.value) {
      q = query(q, where(filter.field, "==", filter.value));
    }
  }

  if (params?.activeOnly !== false) {
    q = query(q, where("active", "==", true));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() ?? new Date(),
    updatedAt: doc.data().updatedAt?.toDate() ?? new Date(),
  } as Vehicle));
}

/**
 * Get vehicles by trim ID.
 */
export async function getVehiclesByTrim(trimId: string): Promise<Vehicle[]> {
  const q = query(
    collection(db, VEHICLE_COLLECTION),
    where("trimId", "==", trimId),
    where("active", "==", true)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() ?? new Date(),
    updatedAt: doc.data().updatedAt?.toDate() ?? new Date(),
  } as Vehicle));
}

/**
 * Check if a vehicle exists.
 */
export async function existsVehicle(vehicleId: string): Promise<boolean> {
  const docRef = doc(db, VEHICLE_COLLECTION, vehicleId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}