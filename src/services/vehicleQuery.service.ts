/**
 * Vehicle Query Layer (B5)
 *
 * Read-only orchestration layer that aggregates data from:
 * - manufacturers
 * - models
 * - vehicleGenerations
 * - vehicleTrims
 * - vehicles
 *
 * This layer does NOT replace existing services.
 * It is a read-only aggregation layer.
 */

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


import {
  getVehicles,
  getVehicleById,
} from "./vehicle.service";

import type { Vehicle } from "../types/vehicle";
import type { Manufacturer } from "../types/manufacturer";
import type { Model } from "../types/model";
import type { GenerationData as VehicleGeneration } from "../types/vehicleGeneration";
import type { VehicleTrim } from "../types/vehicleTrim";

// ---------------------------------------------------------------------------
// Helper: resolve document ID (string | Firestore DocumentReference)
// ---------------------------------------------------------------------------

function resolveDocId(value: unknown): string | null {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  if (value && typeof value === "object" && "id" in value && typeof (value as { id: unknown }).id === "string") {
    return (value as { id: string }).id;
  }
  return null;
}

// ---------------------------------------------------------------------------
// getVehicleHierarchy(vehicleId)
//
// Returns a nested object:
//   {
//     vehicle: Vehicle,
//     trim: VehicleTrim | null,
//     generation: VehicleGeneration | null,
//     model: Model | null,
//     manufacturer: Manufacturer | null
//   }
// ---------------------------------------------------------------------------

export async function getVehicleHierarchy(vehicleId: string) {
  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) {
    return null;
  }

  // Navigation IDs are directly on the Vehicle interface
  const manufacturerId = resolveDocId(vehicle.manufacturerId ?? (vehicle as unknown as Record<string, unknown>).manufacturerId);
  const modelId = resolveDocId(vehicle.modelId ?? (vehicle as unknown as Record<string, unknown>).modelId);
  const generationId = resolveDocId(vehicle.generationId ?? (vehicle as unknown as Record<string, unknown>).generationId);
  const trimId = resolveDocId(vehicle.trimId ?? (vehicle as unknown as Record<string, unknown>).trimId);

  // Fetch parent documents in parallel (only when IDs exist)
  const [manufacturerSnap, modelSnap, generationSnap, trimSnap] = await Promise.all([
    manufacturerId ? getDoc(doc(db, "manufacturers", manufacturerId)).catch(() => null as unknown as ReturnType<typeof getDoc>) : null,
    modelId ? getDoc(doc(db, "models", modelId)).catch(() => null as unknown as ReturnType<typeof getDoc>) : null,
    generationId ? getDoc(doc(db, "vehicleGenerations", generationId)).catch(() => null as unknown as ReturnType<typeof getDoc>) : null,
    trimId ? getDoc(doc(db, "vehicleTrims", trimId)).catch(() => null as unknown as ReturnType<typeof getDoc>) : null,
  ]);

  return {
    vehicle,
    trim: (trimSnap?.data()) as VehicleTrim | null,
    generation: (generationSnap?.data()) as VehicleGeneration | null,
    model: (modelSnap?.data()) as Model | null,
    manufacturer: (manufacturerSnap?.data()) as Manufacturer | null,
  } as const;
}

// ---------------------------------------------------------------------------
// getVehicleFullName(vehicleId)
//
// Example: "Toyota Corolla 2023 GLI"
// ---------------------------------------------------------------------------

export async function getVehicleFullName(vehicleId: string): Promise<string> {
  const hierarchy = await getVehicleHierarchy(vehicleId);
  if (!hierarchy || !hierarchy.vehicle) {
    return "";
  }

  const parts: string[] = [];

  if (hierarchy.manufacturer?.name) {
    parts.push(hierarchy.manufacturer.name);
  }

  if (hierarchy.model?.name) {
    parts.push(hierarchy.model.name);
  }

  // Year from vehicle.modelYear
  const modelYear = hierarchy.vehicle.modelYear;
  if (modelYear) {
    parts.push(String(modelYear));
  }

  if (hierarchy.trim?.trimName) {
    parts.push(hierarchy.trim.trimName);
  }

  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// getVehiclesForModel(modelId)
// ---------------------------------------------------------------------------

export async function getVehiclesForModel(modelId: string): Promise<Vehicle[]> {
  const allVehicles = await getVehicles();
  return allVehicles.filter((v: Vehicle): boolean => {
    const vModelId = (v.modelId as unknown as string) ?? resolveDocId(v.modelId);
    return vModelId === modelId;
  });
}

// ---------------------------------------------------------------------------
// getVehiclesForGeneration(generationId)
// ---------------------------------------------------------------------------

export async function getVehiclesForGeneration(generationId: string): Promise<Vehicle[]> {
  const allVehicles = await getVehicles();
  return allVehicles.filter((v: Vehicle): boolean => {
    const vGenerationId = (v.generationId as unknown as string) ?? resolveDocId(v.generationId);
    return vGenerationId === generationId;
  });
}

// ---------------------------------------------------------------------------
// getVehiclesForTrim(trimId)
// ---------------------------------------------------------------------------

export async function getVehiclesForTrim(trimId: string): Promise<Vehicle[]> {
  const allVehicles = await getVehicles();
  return allVehicles.filter((v: Vehicle): boolean => {
    const vTrimId = (v.trimId as unknown as string) ?? resolveDocId(v.trimId);
    return vTrimId === trimId;
  });
}