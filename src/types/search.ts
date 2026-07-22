/**
 * Search Layer Types (B6)
 */

export type BodyType =
  | "sedan" | "hatchback" | "suv" | "pickup" | "coupe"
  | "convertible" | "wagon" | "van" | "bus" | "truck";

export type FuelType =
  | "gasoline" | "diesel" | "electric" | "hybrid"
  | "plug-in-hybrid" | "lpg" | "cng";

export type Transmission =
  | "manual" | "automatic" | "cvte" | "semi-automatic" | "other";

export type Drivetrain =
  | "rwd" | "fwd" | "awd" | "4wd"
  | "all-wheel-drive" | "front-wheel-drive" | "rear-wheel-drive";

export type VehicleSortField =
  | "createdAt" | "updatedAt" | "price" | "mileage"
  | "modelYear" | "manufacturer" | "model" | "condition";

export type VehicleSortDirection = "asc" | "desc";

export interface VehicleSearchFilters {
  query?: string;
  manufacturerId?: string;
  modelId?: string;
  generationId?: string;
  trimId?: string;
  modelYear?: number;
  bodyType?: BodyType | null;
  fuelType?: FuelType | null;
  transmission?: Transmission | null;
  drivetrain?: Drivetrain | null;
  active?: boolean;
  text?: string;
  limit?: number;
  offset?: number;
  sortBy?: VehicleSortField;
  sortDirection?: VehicleSortDirection;
}

export interface SearchResult {
  vehicles: VehicleDocument[];
  total: number;
  offset: number;
}

export interface VehicleDocument {
  id: string;
  manufacturerId: string;
  modelId?: string;
  generationId?: string;
  trimId?: string;
  modelYear: number;
  bodyType: BodyType;
  fuelType: FuelType;
  transmission: Transmission;
  drivetrain: Drivetrain;
  price?: number;
  mileage?: number;
  condition?: "new" | "used";
  active: boolean;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LatestVehiclesResult {
  vehicles: VehicleDocument[];
}


