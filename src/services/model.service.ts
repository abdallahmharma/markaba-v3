/**
 * Model Service - Sprint B1
 *
 * Firebase Firestore operations for vehicle models.
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
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Model, CreateModelInput, UpdateModelInput } from "../types/model";

/**
 * Convert Firestore document to Model type
 */
function snapshotToModel(doc: any): Model {
  const data = doc.data();
  return {
    id: doc.id,
    manufacturerId: data.manufacturerId ?? "",
    name: data.name ?? "",
    slug: data.slug ?? "",
    active: data.active ?? true,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
  };
}

/**
 * Create a new vehicle model
 * @param modelData - Model data (id and timestamps are auto-generated)
 * @returns ID of the created model
 */
export async function createModel(modelData: CreateModelInput): Promise<string> {
  const slug = modelData.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const now = new Date();
  const docRef = await addDoc(collection(db, "models"), {
    id: slug,
    manufacturerId: modelData.manufacturerId,
    name: modelData.name,
    slug,
    active: modelData.active ?? true,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });

  return docRef.id;
}

/**
 * Update an existing model
 * @param modelId - The ID of the model to update
 * @param updates - Fields to update
 */
export async function updateModel(modelId: string, updates: UpdateModelInput): Promise<void> {
  const docRef = doc(db, "models", modelId);

  if (updates.name) {
    updates.slug = updates.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  });
}

/**
 * Delete a model by its ID
 * @param modelId - The ID of the model to delete
 */
export async function deleteModel(modelId: string): Promise<void> {
  await deleteDoc(doc(db, "models", modelId));
}

/**
 * Get a model by its ID
 * @param modelId - The ID (slug) of the model
 * @returns Model document, or null if not found
 */
export async function getModelById(modelId: string): Promise<Model | null> {
  const docRef = doc(db, "models", modelId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return snapshotToModel(docSnap);
}

/**
 * Get all models (active by default)
 * @returns Array of all model documents
 */
export async function getModels(): Promise<Model[]> {
  const modelsRef = collection(db, "models");
  const q = query(modelsRef, orderBy("name", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(snapshotToModel);
}

/**
 * Get all models for a specific manufacturer
 * @param manufacturerId - The Firestore document ID of the manufacturer
 * @returns Array of model documents ordered by name
 */
export async function getModelsByManufacturer(manufacturerId: string): Promise<Model[]> {
  const modelsRef = collection(db, "models");
  const q = query(
    modelsRef,
    where("manufacturerId", "==", manufacturerId),
    orderBy("name", "asc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map(snapshotToModel);
}

/**
 * Get a model by its slug (for routing/SEO)
 * @param slug - The URL-friendly slug of the model
 * @returns Model document, or null if not found
 */
export async function getModelBySlug(slug: string): Promise<Model | null> {
  const modelsRef = collection(db, "models");
  const q = query(modelsRef, where("slug", "==", slug), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return snapshotToModel(snapshot.docs[0]);
}

/**
 * Check if a model with the given name or slug already exists
 * @param manufacturerId - The manufacturer's document ID
 * @param modelName - The model name to check
 * @returns true if a model with that name exists for this manufacturer
 */
export async function modelExists(manufacturerId: string, modelName: string): Promise<boolean> {
  const slug = modelName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const modelsRef = collection(db, "models");
  const q = query(
    modelsRef,
    where("manufacturerId", "==", manufacturerId),
    where("slug", "==", slug),
    limit(1)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
}