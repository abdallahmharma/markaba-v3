/**
 * Vehicle Trim entity interface
 */
export interface VehicleTrim {
  id: string;
  generationId: string;
  trimName: string;
  slug: string;
  description: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  horsepower: number;
  fuelType: string;
  active: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input type for creating a vehicle trim (timestamps and id are auto-generated)
 */
export type CreateVehicleTrimInput = Omit<
  VehicleTrim,
  "id" | "slug" | "deletedAt" | "createdAt" | "updatedAt"
>;

/**
 * Input type for updating a vehicle trim (partial fields)
 */
export type UpdateVehicleTrimInput = Partial<CreateVehicleTrimInput>;