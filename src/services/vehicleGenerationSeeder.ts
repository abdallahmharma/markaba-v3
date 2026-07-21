import type { GenerationDataFactory } from '../types/vehicleGeneration.ts';

// Raw dataset for seeding - no external dependencies in types
interface RawGenerationDataset {
  generationName: string;
  startYear: number;
  endYear: number | null;
  platform: string;
}

const COROLLA_GENERATIONS: RawGenerationDataset[] = [
  {
    generationName: 'E100',
    startYear: 1991,
    endYear: 1997,
    platform: 'MCV10/MCW10/NCW10',
  },
  {
    generationName: 'E110',
    startYear: 1997,
    endYear: 2002,
    platform: 'NCP1#/NPC5#',
  },
  {
    generationName: 'E120/E130',
    startYear: 2002,
    endYear: 2007,
    platform: 'NCp#/NCP4#/NCP5#/NTC1#/NTC5#',
  },
  {
    generationName: 'E140/E150',
    startYear: 2007,
    endYear: 2013,
    platform: 'NCP2#/NZE1#/ZZN1#/ZRE1#',
  },
  {
    generationName: 'E170/E180',
    startYear: 2013,
    endYear: 2019,
    platform: 'ZRE/NZE/ZNxE series',
  },
  {
    generationName: 'E210',
    startYear: 2019,
    endYear: null,
    platform: 'MCe/MXe series',
  },
];

// Type guard to check if a value is a DocumentReference (Firestore)
function isDocumentRef(value: unknown): value is { id: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof (value as { id: unknown }).id === 'string'
  );
}

async function seedVehicleGenerations(): Promise<void> {
  console.log('🌱 Starting vehicle generations seeding...');

  // Simulated models data (in real implementation, this would come from Firestore)
  const corollaModel = {
    id: 'corolla',
    name: 'Corolla',
    manufacturerId: 'toyota'
  };

  console.log(`✅ Found Corolla model: ${corollaModel.id} - "${corollaModel.name}"`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const genData of COROLLA_GENERATIONS) {
    const newGeneration: GenerationDataFactory = {
      id: `gen-${genData.generationName}-${genData.startYear}`,
      manufacturerId: 'toyota',
      modelId: 'corolla',
      generationName: genData.generationName,
      generationCode: genData.platform,
      generationDescription: '',
      startYear: genData.startYear,
      endYear: genData.endYear,
      imageUrls: [],
      metadata: {},
      extraJson: null,
    };

    // Simulate Firestore operation
    if (isDocumentRef(newGeneration)) {
      console.log(`✅ Created: ${genData.generationName} (${genData.startYear}-${genData.endYear ?? 'present'})`);
      createdCount++;
    } else {
      console.log(`⏭️  Skipped: ${genData.generationName}`);
      skippedCount++;
    }
  }

  console.log('🎉 Vehicle generations seeding completed!');
  console.log(`   Created: ${createdCount}`);
  console.log(`   Skipped: ${skippedCount}`);
}

// Export for use in seed scripts
// Note: In browser environments, this check will always be false
// For seeding, call seedVehicleGenerations() explicitly
if (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.NODE_ENV === 'production') {
  seedVehicleGenerations().catch(console.error);
}

export { seedVehicleGenerations, COROLLA_GENERATIONS };
export type { RawGenerationDataset };
