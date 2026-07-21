import { getFirestore } from 'firebase/firestore';
import { app } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import type { 
  GenerationData, 
  GenerationDataFactory,
  GenerationBulkOperations 
} from '../types/vehicleGeneration.ts';

const db = getFirestore(app);
const generationRef = collection(db, 'generations');

// ===== Bulk Operations Implementation =====

export const generationBulkOps: GenerationBulkOperations = {
  validateFactory(factory: GenerationDataFactory): boolean {
    return !!(
      factory.manufacturerId &&
      factory.modelId &&
      factory.generationName &&
      factory.generationCode &&
      factory.startYear
    );
  },

  generateBatch(configs: GenerationDataFactory[]): GenerationData[] {
    const now = Timestamp.now();
    return configs.map((config, index) => ({
      id: `gen_${Date.now()}_${index}`,
      manufacturerId: config.manufacturerId,
      modelId: config.modelId,
      name: config.generationName,
      code: config.generationCode,
      description: config.generationDescription || '',
      imageUrls: config.imageUrls || [],
      startYear: config.startYear,
      endYear: config.endYear ?? null,
      isActive: true,
      metadata: config.metadata || {},
      extraJson: config.extraJson ?? null,
      sortIndex: index,
      createdAt: now,
      updatedAt: now,
    }));
  },

  mergeWithExisting(existing: GenerationData[], fresh: GenerationData[]): GenerationData[] {
    const existingCodes = new Set(existing.map(g => g.code));
    const newGenerations = fresh.filter(g => !existingCodes.has(g.code));
    return [...existing, ...newGenerations];
  },
};

// ===== Queries & Accessor Patterns =====

export async function fetchGenerationsByModel(modelId: string): Promise<GenerationData[]> {
  const q = query(
    generationRef,
    where('modelId', '==', modelId),
    orderBy('startYear', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as GenerationData[];
}

export async function fetchGenerationById(modelId: string, generationCode: string): Promise<GenerationData | null> {
  const q = query(
    generationRef,
    where('modelId', '==', modelId),
    where('code', '==', generationCode)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  const docSnap = snapshot.docs[0];
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as GenerationData;
}

export async function fetchActiveGenerations(): Promise<GenerationData[]> {
  const q = query(
    generationRef,
    where('isActive', '==', true),
    orderBy('startYear', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as GenerationData[];
}

export async function fetchGenerationsByManufacturer(manufacturerId: string): Promise<GenerationData[]> {
  const q = query(
    generationRef,
    where('manufacturerId', '==', manufacturerId),
    orderBy('startYear', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as GenerationData[];
}

export function generateGenerationId(manufacturerId: string, modelId: string, generationCode: string): string {
  return `${manufacturerId}_${modelId}_${generationCode}`.replace(/[^a-zA-Z0-9_]/g, '_');
}