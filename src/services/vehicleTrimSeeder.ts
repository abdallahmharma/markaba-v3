import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import type { CreateVehicleTrimInput } from '../types/vehicleTrim';

const TRIM_DATA: Array<{
  trimName: string;
  trim: Omit<CreateVehicleTrimInput, 'generationId' | 'modelId' | 'manufacturerId'>;
}> = [
  {
    trimName: 'XLI',
    trim: {
      trimName: 'XLI',
      description: 'Base trim with essential features',
      engine: '1.6L I4',
      transmission: 'CVT',
      drivetrain: 'FWD',
      horsepower: 122,
      fuelType: 'Gasoline',
      active: true,
    },
  },
  {
    trimName: 'GLI',
    trim: {
      trimName: 'GLI',
      description: 'Mid-range trim with added comfort and safety features',
      engine: '1.6L I4 Turbo',
      transmission: 'CVT',
      drivetrain: 'FWD',
      horsepower: 150,
      fuelType: 'Gasoline',
      active: true,
    },
  },
  {
    trimName: 'Hybrid',
    trim: {
      trimName: 'Hybrid',
      description: 'Fuel-efficient hybrid variant',
      engine: '1.8L I4 Hybrid',
      transmission: 'CVT',
      drivetrain: 'FWD',
      horsepower: 121,
      fuelType: 'Hybrid',
      active: true,
    },
  },
];

async function getOrCreateTrim(
  generationId: string,
  _modelId: string,
  _manufacturerId: string,
  trimName: string,
  trimData: Omit<CreateVehicleTrimInput, 'generationId' | 'modelId' | 'manufacturerId'>
): Promise<string> {
  const trimsRef = collection(db, 'trims');
  const q = query(
    trimsRef,
    where('trimName', '==', trimName),
    where('generationId', '==', generationId),
    where('modelId', '==', _modelId)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const existing = snapshot.docs[0];
    return existing.id;
  }

  const newTrimDoc: CreateVehicleTrimInput = {
    ...trimData,
    generationId,
  };

  const newDocRef = doc(trimsRef);
  await setDoc(newDocRef, {
    ...newTrimDoc,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  } as Record<string, unknown>);

  return newDocRef.id;
}

export async function runVehicleTrimSeeder(): Promise<void> {
  console.log('Starting vehicle trim seeder...');

  // Fetch all manufacturers
  const manufacturersRef = collection(db, 'manufacturers');
  const manufacturersSnapshot = await getDocs(manufacturersRef);

  for (const manufacturerDoc of manufacturersSnapshot.docs) {
    const manufacturerId = manufacturerDoc.id;
    const manufacturerData = manufacturerDoc.data();

    // Fetch models for this manufacturer
    const modelsRef = collection(db, 'models');
    const modelsQuery = query(modelsRef, where('manufacturerId', '==', manufacturerId));
    const modelsSnapshot = await getDocs(modelsQuery);

    for (const modelDoc of modelsSnapshot.docs) {
      const modelId = modelDoc.id;
      const modelData = modelDoc.data();

      // Fetch generations for this model
      const generationsRef = collection(db, 'generations');
      const generationsQuery = query(generationsRef, where('modelId', '==', modelId));
      const generationsSnapshot = await getDocs(generationsQuery);

      for (const generationDoc of generationsSnapshot.docs) {
        const generationId = generationDoc.id;
        const generationData = generationDoc.data();

        // Check if this generation matches our criteria
        if (
          (manufacturerData.name === 'Toyota' &&
            modelData.modelName === 'Corolla' &&
            generationData.name === 'E210')
        ) {
          console.log(`Seeding trims for ${manufacturerData.name} ${modelData.modelName} ${generationData.name}`);

          for (const trimItem of TRIM_DATA) {
            const trimId = await getOrCreateTrim(
              generationId,
              modelId,
              manufacturerId,
              trimItem.trimName,
              trimItem.trim
            );
            console.log(`  Seeded trim: ${trimItem.trimName} (ID: ${trimId})`);
          }
        }
      }
    }
  }

  console.log('Vehicle trim seeder completed.');
}