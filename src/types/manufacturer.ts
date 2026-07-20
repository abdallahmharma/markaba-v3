/**
 * Manufacturer entity interface
 */
export interface Manufacturer {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  country: string;
  createdAt: Date | null;
}