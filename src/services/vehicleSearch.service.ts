/**
 * Vehicle Search Service (B6)
 * 
 * Production-ready read-only search layer for vehicles.
 * Reuses existing vehicle.service functions for Firestore access.
 */

import type {
  VehicleSearchFilters,
  SearchResult,
  LatestVehiclesResult,
  VehicleDocument,
  VehicleSortField,
  VehicleSortDirection,
} from "../types/search";
import { getVehicles } from "./vehicle.service";
import type { Vehicle } from "../types/vehicle";

// =========================================================
// Type mapping: Vehicle (from Firestore) -> VehicleDocument
// =========================================================

function toVehicleDocument(v: Vehicle, id: string): VehicleDocument {
  const data = v as unknown as Record<string, unknown>;
  
  return {
    id,
    manufacturerId: v.manufacturerId,
    modelId: (data.modelId as string | undefined) ?? undefined,
    generationId: (data.generationId as string | undefined) ?? undefined,
    trimId: (data.trimId as string | undefined) ?? undefined,
    modelYear: (data.modelYear as number) ?? v.modelYear,
    bodyType: (data.bodyType as VehicleDocument["bodyType"]) ?? "sedan",
    fuelType: (data.fuelType as VehicleDocument["fuelType"]) ?? "gasoline",
    transmission: (data.transmission as VehicleDocument["transmission"]) ?? "manual",
    drivetrain: (data.drivetrain as VehicleDocument["drivetrain"]) ?? "rwd",
    price: data.price as number | undefined,
    mileage: data.mileage as number | undefined,
    condition: data.condition as "new" | "used" | undefined,
    active: v.active ?? true,
    images: data.images as string[] | undefined,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  };
}

// =========================================================
// Sorting helpers
// =========================================================

const SORT_FIELD_MAP: Record<VehicleSortField, keyof VehicleDocument> = {
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  price: "price",
  mileage: "mileage",
  modelYear: "modelYear",
  manufacturer: "manufacturerId",
  model: "modelId",
  condition: "condition",
};

function applySorting(vehicles: VehicleDocument[], sortBy?: VehicleSortField, sortDirection?: VehicleSortDirection): VehicleDocument[] {
  if (!sortBy) return vehicles;
  
  const field = SORT_FIELD_MAP[sortBy];
  const direction = sortDirection ?? "desc";
  const multiplier = direction === "asc" ? 1 : -1;
  
  return [...vehicles].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return multiplier;
    if (bVal == null) return -multiplier;
    
    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * multiplier;
    }
    
    if (aVal instanceof Date && bVal instanceof Date) {
      return (aVal.getTime() - bVal.getTime()) * multiplier;
    }
    
    return String(aVal).localeCompare(String(bVal)) * multiplier;
  });
}

// =========================================================
// Public Methods
// =========================================================

/**
 * Search vehicles with optional filters.
 */
export async function searchVehicles(filters: VehicleSearchFilters = {}): Promise<SearchResult> {
  // Fetch all vehicles (respecting activeOnly filter)
  const activeOnly = filters.active === false ? false : (filters.active === undefined ? true : filters.active);
  const vehicles = await getVehicles({ activeOnly });
  
  // Convert to VehicleDocument and apply text filtering
  let results: VehicleDocument[] = [];
  
  for (const v of vehicles) {
    const doc = toVehicleDocument(v, v.id);
    results.push(doc);
  }
  
  // Apply manufacturer filter
  if (filters.manufacturerId) {
    results = results.filter((v) => v.manufacturerId === filters.manufacturerId);
  }
  
  // Apply model filter
  if (filters.modelId) {
    results = results.filter((v) => v.modelId === filters.modelId);
  }
  
  // Apply generation filter
  if (filters.generationId) {
    results = results.filter((v) => v.generationId === filters.generationId);
  }
  
  // Apply trim filter
  if (filters.trimId) {
    results = results.filter((v) => v.trimId === filters.trimId);
  }
  
  // Apply model year filter
  if (filters.modelYear) {
    results = results.filter((v) => v.modelYear === filters.modelYear);
  }
  
  // Apply bodyType filter
  if (filters.bodyType) {
    results = results.filter((v) => v.bodyType === filters.bodyType);
  }
  
  // Apply fuelType filter
  if (filters.fuelType) {
    results = results.filter((v) => v.fuelType === filters.fuelType);
  }
  
  // Apply transmission filter
  if (filters.transmission) {
    results = results.filter((v) => v.transmission === filters.transmission);
  }
  
  // Apply drivetrain filter
  if (filters.drivetrain) {
    results = results.filter((v) => v.drivetrain === filters.drivetrain);
  }
  
  // Apply text search on manufacturerId, modelId, generationId, trimId
  if (filters.text) {
    const searchText = filters.text.toLowerCase();
    results = results.filter((v) =>
      v.manufacturerId.toLowerCase().includes(searchText) ||
      v.modelId?.toLowerCase().includes(searchText) ||
      v.generationId?.toLowerCase().includes(searchText) ||
      v.trimId?.toLowerCase().includes(searchText)
    );
  }
  
  // Apply sorting
  results = applySorting(results, filters.sortBy, filters.sortDirection);
  
  // Get total before pagination
  const total = results.length;
  
  // Apply pagination
  const offset = filters.offset ?? 0;
  const limit = filters.limit ?? results.length;
  const paginatedResults = results.slice(offset, offset + limit);
  
  return {
    vehicles: paginatedResults,
    total,
    offset,
  };
}

/**
 * Get the latest vehicles sorted by createdAt descending.
 */
export async function getLatestVehicles(limit: number = 10): Promise<LatestVehiclesResult> {
  const vehicles = await getVehicles({ activeOnly: true });
  
  const docs: VehicleDocument[] = [];
  for (const v of vehicles) {
    docs.push(toVehicleDocument(v, v.id));
  }
  
  // Sort by createdAt descending
  docs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  // Slice to limit
  const sliced = docs.slice(0, limit);
  
  return { vehicles: sliced };
}

/**
 * Get vehicles filtered by manufacturer.
 */
export async function getVehiclesByManufacturer(manufacturerId: string): Promise<SearchResult> {
  const vehicles = await getVehicles({ activeOnly: true });
  
  const results: VehicleDocument[] = [];
  for (const v of vehicles) {
    if (v.manufacturerId === manufacturerId) {
      results.push(toVehicleDocument(v, v.id));
    }
  }
  
  return {
    vehicles: results,
    total: results.length,
    offset: 0,
  };
}

/**
 * Get vehicles filtered by body type.
 */
export async function getVehiclesByBodyType(bodyType: string): Promise<SearchResult> {
  const vehicles = await getVehicles({ activeOnly: true });
  
  const results: VehicleDocument[] = [];
  for (const v of vehicles) {
    const doc = toVehicleDocument(v, v.id);
    if (doc.bodyType === bodyType) {
      results.push(doc);
    }
  }
  
  return {
    vehicles: results,
    total: results.length,
    offset: 0,
  };
}

/**
 * Get vehicles filtered by fuel type.
 */
export async function getVehiclesByFuelType(fuelType: string): Promise<SearchResult> {
  const vehicles = await getVehicles({ activeOnly: true });
  
  const results: VehicleDocument[] = [];
  for (const v of vehicles) {
    const doc = toVehicleDocument(v, v.id);
    if (doc.fuelType === fuelType) {
      results.push(doc);
    }
  }
  
  return {
    vehicles: results,
    total: results.length,
    offset: 0,
  };
}

/**
 * Get vehicles filtered by model year.
 */
export async function getVehiclesByYear(year: number): Promise<SearchResult> {
  const vehicles = await getVehicles({ activeOnly: true });
  
  const results: VehicleDocument[] = [];
  for (const v of vehicles) {
    const doc = toVehicleDocument(v, v.id);
    if (doc.modelYear === year) {
      results.push(doc);
    }
  }
  
  return {
    vehicles: results,
    total: results.length,
    offset: 0,
  };
}

// =========================================================
// Exports
// =========================================================

export { SORT_FIELD_MAP };