/**
 * Vehicle Type Definitions - Sprint B4
 */

export interface Vehicle {
  id: string;
  manufacturerId: string;
  modelId: string;
  generationId: string | null;
  trimId: string | null;
  modelYear: number;
  active: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVehicleInput {
  manufacturerId: string;
  modelId: string;
  generationId?: string;
  trimId?: string;
  modelYear: number;
}

export interface UpdateVehicleInput {
  manufacturerId?: string;
  modelId?: string;
  generationId?: string;
  trimId?: string;
  modelYear?: number;
}