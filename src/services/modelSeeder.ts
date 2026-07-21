/**
 * Model Seeder - Sprint B1
 * Seeds Toyota models into Firestore (idempotent).
 */

import { db } from "../firebase";
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from "firebase/firestore";
import { createModel } from "./model.service";

const TOYOTA_SLUG = "toyota";

interface SeedModel { name: string; active: boolean }

const TOYOTA_MODELS: SeedModel[] = [
  { name: "4Runner", active: true },
  { name: "86", active: true },
  { name: "Avalon", active: true },
  { name: "C-HR", active: true },
  { name: "Camry", active: true },
  { name: "Corolla", active: true },
  { name: "Corolla Cross", active: true },
  { name: "Corolla Hatchback", active: true },
  { name: "GR86", active: true },
  { name: "GR Corolla", active: true },
  { name: "GR Supra", active: true },
  { name: "GR Yaris", active: true },
  { name: "Highlander", active: true },
  { name: "Land Cruiser", active: true },
  { name: "Mirai", active: true },
  { name: "Prius", active: true },
  { name: "Prius Prime", active: true },
  { name: "RAV4", active: true },
  { name: "RAV4 Prime", active: true },
  { name: "Sequoia", active: true },
  { name: "Sienna", active: true },
  { name: "Tacoma", active: true },
  { name: "Tundra", active: true },
  { name: "Venza", active: true },
  { name: "Yaris", active: true },
  { name: "bZ4X", active: true },
];

interface ManufacturerRef { id: string; slug: string }

async function getManufacturers(): Promise<ManufacturerRef[]> {
  const snapshot = await getDocs(query(collection(db, "manufacturers"), orderBy("name", "asc")));
  return snapshot.docs.map((d) => ({ id: d.id, slug: (d.data().slug as string) || d.id }));
}

async function clearToyotaModels(toyotaId: string): Promise<void> {
  const snapshot = await getDocs(query(collection(db, "models"), where("manufacturerId", "==", toyotaId)));
  const promises: Promise<void>[] = [];
  for (const document of snapshot.docs) {
    promises.push(deleteDoc(doc(db, "models", document.id)));
  }
  await Promise.all(promises);
  console.log(`Cleared ${promises.length} Toyota models.`);
}

/** Seed Toyota models into Firestore (idempotent). */
export async function seedToyotaModels(): Promise<void> {
  console.log("Seeding Toyota models...");
  const manufacturers = await getManufacturers();
  const toyota = manufacturers.find((m) => m.slug === TOYOTA_SLUG);
  if (!toyota) {
    console.error("Toyota manufacturer not found. Run seedManufacturers.ts first.");
    return;
  }

  await clearToyotaModels(toyota.id);

  let created = 0;
  for (const model of TOYOTA_MODELS) {
    await createModel({ manufacturerId: toyota.id, name: model.name, slug: model.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, ""), active: model.active });
    created++;
  }

  console.log(`Seeded ${created} Toyota models.`);
}

seedToyotaModels().catch(console.error);