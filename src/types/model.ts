/**
 * Model entity interface
 */
export interface Model {
  id: string;
  manufacturerId: string;
  name: string;
  slug: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input type for creating a model (timestamps and id are auto-generated)
 */
export type CreateModelInput = Omit<Model, "id" | "createdAt" | "updatedAt">;

/**
 * Input type for updating a model (partial fields)
 */
export type UpdateModelInput = Partial<CreateModelInput>;