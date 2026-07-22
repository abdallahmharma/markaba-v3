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

import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";

import {
  fetchManufacturers,
  fetchModels as fetchModelsList,
  getModelByManufacturer,
} from "./manufacturer.service";

import { fetchModels } from "./model.service";

import {
  fetchVehicleGenerations as fetchGenerationsList,
  getGenerationById,
} from "./vehicleGeneration.service";

import {
  fetchVehicleTrims as fetchTrimsList,
  getTrimById,
} from "./vehicleTrim.service";

import {
  fetchVehicles,
  getVehicleById,
} from "./vehicle.service";

import { Vehicle } from "@/types/vehicle";

// ---------------------------------------------------------------------------
// Type aliases for clarity
// ---------------------------------------------------------------------------

type Manufacturer = ReturnType<typeof fetchManufacturers extends Promise<infer T> ? T : never>[number];
type Model = ReturnType<typeof fetchModels extends Promise<infer T> ? T : never>[number];
type VehicleGeneration = ReturnType<typeof fetchGenerationsList extends Promise<infer T> ? T : never>[number];
type VehicleTrim = ReturnType<typeof fetchTrimsList extends Promise<infer T> ? T : never>[number];

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

  // Resolve navigation IDs from the vehicle document
  const manufacturerId = resolveDocId((vehicle as Record<string, unknown>).manufacturerId ?? (vehicle as any).manufacturerId);
  const modelId = resolveDocId((vehicle as Record<string, unknown>).modelId ?? (vehicle as any).modelId);
  const generationId = resolveDocId((vehicle as Record<string, unknown>).generationId ?? (vehicle as any).generationId);
  const trimId = resolveDocId((vehicle as Record<string, unknown>).trimId ?? (vehicle as any).trimId);

  // Fetch parent documents in parallel (only when IDs exist)
  const [manufacturerSnap, modelSnap, generationSnap, trimSnap] = await Promise.all([
    manufacturerId ? getDoc(doc(db, "manufacturers", manufacturerId)).catch(() => null as any) : null,
    modelId ? getDoc(doc(db, "models", modelId)).catch(() => null as any) : null,
    generationId ? getDoc(doc(db, "vehicleGenerations", generationId)).catch(() => null as any) : null,
    trimId ? getDoc(doc(db, "vehicleTrims", trimId)).catch(() => null as any) : null,
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

  // Year from vehicle data or generation
  const year = (hierarchy.vehicle as Record<string, unknown>).year ?? (hierarchy.vehicle as any).year;
  if (year) {
    parts.push(String(year));
  }

  if (hierarchy.trim?.name) {
    parts.push(hierarchy.trim.name);
  }

  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// getVehiclesForModel(modelId)
// ---------------------------------------------------------------------------

export async function getVehiclesForModel(modelId: string): Promise<Vehicle[]> {
  const allVehicles = await fetchVehicles();
  return allVehicles.filter((v) => {
    const mid = resolveDocId((v as Record<string, unknown>).modelId ?? (v as any).modelId);
    return mid === modelId;
  });
}

// ---------------------------------------------------------------------------
// getVehiclesForGeneration(generationId)
// ---------------------------------------------------------------------------

export async function getVehiclesForGeneration(generationId: string): Promise<Vehicle[]> {
  const allVehicles = await fetchVehicles();
  return allVehicles.filter((v) => {
    const gid = resolveDocId((v as Record<string, unknown>).generationId ?? (v as any).generationId);
    return gid === generationId;
  });
}

// ---------------------------------------------------------------------------
// getVehiclesForTrim(trimId)
// ---------------------------------------------------------------------------

export async function getVehiclesForTrim(trimId: string): Promise<Vehicle[]> {
  const allVehicles = await fetchVehicles();
  return allVehicles.filter((v) => {
    const tid = resolveDocId((v as Record<string, unknown>).trimId ?? (v as any).trimId);
    return tid === trimId;
  });
}