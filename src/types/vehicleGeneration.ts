/**
 * Vehicle Generation Types
 *
 * All generations for Toyota, Honda, Nissan models
 */

import { Timestamp } from 'firebase/firestore';

// ===== Generation Data Model =====

export interface GenerationData {
  id: string;
  modelId: string;
  manufacturerId: string;
  name: string;
  code: string;
  description: string;
  imageUrls: string[];
  startYear: number;
  endYear: number | null;
  isActive: boolean;
  metadata: Record<string, unknown>;
  extraJson: string | null;
  sortIndex: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ===== Data Factory (seeded) =====

export interface GenerationDataFactory {
  id: string;
  manufacturerId: string;
  modelId: string;
  generationName: string;
  generationCode: string;
  generationDescription: string;
  startYear: number;
  endYear: number | null;
  imageUrls: string[];
  metadata: Record<string, unknown>;
  extraJson: string | null;
}

export interface GenerationSeedData {
  factory: GenerationDataFactory;
}

// ===== Generator Configuration =====

/** Builder for generation data (set then commit via extraJson) */
export interface VehicleGenerationBuilder {
  setYearRange(start: number, end: number | null): void;
  setDescription(desc: string): void;
  setImageUrls(urls: string[]): void;
  setCode(code: string): void;
  setMetadata(data: Record<string, unknown>): void;
  setExtraJson(json: string): void;
  commit(): GenerationDataFactory;
}

export interface GenerationConfig {
  createBuilder(manufacturerId: string, modelId: string, generationName: string): VehicleGenerationBuilder;
}

// ===== Bulk Operations =====

export interface BulkGenerationResult {
  success: boolean;
  created: number;
  failed: number;
  errors: string[];
}

export interface GenerationBulkOperations {
  validateFactory(factory: GenerationDataFactory): boolean;
  generateBatch(configs: GenerationDataFactory[]): GenerationData[];
  mergeWithExisting(existing: GenerationData[], fresh: GenerationData[]): GenerationData[];
}

// ===== Queries & Accessor Patterns =====

export interface GenerationQueryFilters {
  manufacturerId?: string;
  modelId?: string;
  isActive?: boolean;
  yearRange?: [number, number | null];
}

export interface GenerationQueries {
  filterByManufacturer(manufacturerId: string): GenerationData[];
  filterByModel(modelId: string): GenerationData[];
  filterActive(): GenerationData[];
  filterByYearRange(start: number, end: number | null): GenerationData[];
}

export interface GenerationCollections {
  byManufacturer(manufacturerId: string): GenerationData[];
  byModel(modelId: string): GenerationData[];
  active(): GenerationData[];
  all(): GenerationData[];
}