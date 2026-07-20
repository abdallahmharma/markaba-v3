import { db } from "../firebase";
import { addDoc, collection, doc, getDocs, limit, query, where } from "firebase/firestore";

interface ModelData {
  id: string;
  manufacturerSlug: string;
  name: string;
  slug: string;
  active: boolean;
  createdAt: Date;
}

const toyotaModels: ModelData[] = [
  { id: "corolla", manufacturerSlug: "toyota", name: "Corolla", slug: "corolla", active: true, createdAt: new Date() },
  { id: "camry", manufacturerSlug: "toyota", name: "Camry", slug: "camry", active: true, createdAt: new Date() },
  { id: "yaris", manufacturerSlug: "toyota", name: "Yaris", slug: "yaris", active: true, createdAt: new Date() },
  { id: "avalon", manufacturerSlug: "toyota", name: "Avalon", slug: "avalon", active: true, createdAt: new Date() },
  { id: "crown", manufacturerSlug: "toyota", name: "Crown", slug: "crown", active: true, createdAt: new Date() },
  { id: "prius", manufacturerSlug: "toyota", name: "Prius", slug: "prius", active: true, createdAt: new Date() },
  { id: "rav4", manufacturerSlug: "toyota", name: "RAV4", slug: "rav4", active: true, createdAt: new Date() },
  { id: "highlander", manufacturerSlug: "toyota", name: "Highlander", slug: "highlander", active: true, createdAt: new Date() },
  { id: "land-cruiser", manufacturerSlug: "toyota", name: "Land Cruiser", slug: "land-cruiser", active: true, createdAt: new Date() },
  { id: "land-cruiser-prado", manufacturerSlug: "toyota", name: "Land Cruiser Prado", slug: "land-cruiser-prado", active: true, createdAt: new Date() },
  { id: "fortuner", manufacturerSlug: "toyota", name: "Fortuner", slug: "fortuner", active: true, createdAt: new Date() },
  { id: "hilux", manufacturerSlug: "toyota", name: "Hilux", slug: "hilux", active: true, createdAt: new Date() },
  { id: "tacoma", manufacturerSlug: "toyota", name: "Tacoma", slug: "tacoma", active: true, createdAt: new Date() },
  { id: "sequoia", manufacturerSlug: "toyota", name: "Sequoia", slug: "sequoia", active: true, createdAt: new Date() },
  { id: "4runner", manufacturerSlug: "toyota", name: "4Runner", slug: "4runner", active: true, createdAt: new Date() },
  { id: "c-hr", manufacturerSlug: "toyota", name: "C-HR", slug: "c-hr", active: true, createdAt: new Date() },
  { id: "raize", manufacturerSlug: "toyota", name: "Raize", slug: "raize", active: true, createdAt: new Date() },
  { id: "urban-jumper", manufacturerSlug: "toyota", name: "Urban Cruiser", slug: "urban-jumper", active: true, createdAt: new Date() },
  { id: "supra", manufacturerSlug: "toyota", name: "Supra", slug: "supra", active: true, createdAt: new Date() },
  { id: "gr86", manufacturerSlug: "toyota", name: "GR86", slug: "gr86", active: true, createdAt: new Date() },
  { id: "gr-yaris", manufacturerSlug: "toyota", name: "GR Yaris", slug: "gr-yaris", active: true, createdAt: new Date() },
  { id: "gr-corolla", manufacturerSlug: "toyota", name: "GR Corolla", slug: "gr-corolla", active: true, createdAt: new Date() },
  { id: "sienna", manufacturerSlug: "toyota", name: "Sienna", slug: "sienna", active: true, createdAt: new Date() },
  { id: "veloz", manufacturerSlug: "toyota", name: "Veloz", slug: "veloz", active: true, createdAt: new Date() },
  { id: "rush", manufacturerSlug: "toyota", name: "Rush", slug: "rush", active: true, createdAt: new Date() },
  { id: "avanza", manufacturerSlug: "toyota", name: "Avanza", slug: "avanza", active: true, createdAt: new Date() },
];

async function seedToyotaModels() {
  const modelsRef = collection(db, "models");
  const q = query(modelsRef, where("manufacturerSlug", "==", "toyota"), limit(1));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    console.log("Toyota models already exist. Skipping seed.");
    return;
  }

  for (const model of toyotaModels) {
    await addDoc(modelsRef, {
      id: model.id,
      manufacturerSlug: model.manufacturerSlug,
      name: model.name,
      slug: model.slug,
      active: model.active,
      createdAt: model.createdAt,
    });
    console.log(`Added model: ${model.name}`);
  }

  console.log(`Seeded ${toyotaModels.length} Toyota models.`);
}

seedToyotaModels();