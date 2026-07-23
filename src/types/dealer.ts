/**
 * Dealer entity interface
 */
export interface Dealer {
  id: string;
  name: string;
  city: string;
  phone: string;
  website: string | null;
  brands: string[];
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

/**
 * Input for creating a new dealer (excludes id)
 */
export type CreateDealerInput = Omit<Dealer, "id">;

/**
 * Input for updating an existing dealer (all fields optional)
 */
export type UpdateDealerInput = Partial<Omit<Dealer, "id">>;