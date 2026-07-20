import { db } from "../firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

export interface ManufacturerData {
  name: string;
  slug: string;
  country: string;
  logoUrl: string;
  createdAt: Date;
}

const manufacturers: ManufacturerData[] = [
  { name: "Toyota", slug: "toyota", country: "Japan", logoUrl: "", createdAt: new Date() },
  { name: "Lexus", slug: "lexus", country: "Japan", logoUrl: "", createdAt: new Date() },
  { name: "Honda", slug: "honda", country: "Japan", logoUrl: "", createdAt: new Date() },
  { name: "Nissan", slug: "nissan", country: "Japan", logoUrl: "", createdAt: new Date() },
  { name: "Mazda", slug: "mazda", country: "Japan", logoUrl: "", createdAt: new Date() },
  { name: "Mitsubishi", slug: "mitsubishi", country: "Japan", logoUrl: "", createdAt: new Date() },
  { name: "Subaru", slug: "subaru", country: "Japan", logoUrl: "", createdAt: new Date() },
  { name: "Suzuki", slug: "suzuki", country: "Japan", logoUrl: "", createdAt: new Date() },
  { name: "Hyundai", slug: "hyundai", country: "South Korea", logoUrl: "", createdAt: new Date() },
  { name: "Kia", slug: "kia", country: "South Korea", logoUrl: "", createdAt: new Date() },
  { name: "Genesis", slug: "genesis", country: "South Korea", logoUrl: "", createdAt: new Date() },
  { name: "BMW", slug: "bmw", country: "Germany", logoUrl: "", createdAt: new Date() },
  { name: "Mercedes-Benz", slug: "mercedes-benz", country: "Germany", logoUrl: "", createdAt: new Date() },
  { name: "Audi", slug: "audi", country: "Germany", logoUrl: "", createdAt: new Date() },
  { name: "Volkswagen", slug: "volkswagen", country: "Germany", logoUrl: "", createdAt: new Date() },
  { name: "Porsche", slug: "porsche", country: "Germany", logoUrl: "", createdAt: new Date() },
  { name: "Opel", slug: "opel", country: "Germany", logoUrl: "", createdAt: new Date() },
  { name: "Volvo", slug: "volvo", country: "Sweden", logoUrl: "", createdAt: new Date() },
  { name: "Peugeot", slug: "peugeot", country: "France", logoUrl: "", createdAt: new Date() },
  { name: "Renault", slug: "renault", country: "France", logoUrl: "", createdAt: new Date() },
  { name: "Citroen", slug: "citroen", country: "France", logoUrl: "", createdAt: new Date() },
  { name: "Fiat", slug: "fiat", country: "Italy", logoUrl: "", createdAt: new Date() },
  { name: "Ferrari", slug: "ferrari", country: "Italy", logoUrl: "", createdAt: new Date() },
  { name: "Lamborghini", slug: "lamborghini", country: "Italy", logoUrl: "", createdAt: new Date() },
  { name: "Maserati", slug: "maserati", country: "Italy", logoUrl: "", createdAt: new Date() },
  { name: "Chevrolet", slug: "chevrolet", country: "USA", logoUrl: "", createdAt: new Date() },
  { name: "GMC", slug: "gmc", country: "USA", logoUrl: "", createdAt: new Date() },
  { name: "Cadillac", slug: "cadillac", country: "USA", logoUrl: "", createdAt: new Date() },
  { name: "Ford", slug: "ford", country: "USA", logoUrl: "", createdAt: new Date() },
  { name: "Lincoln", slug: "lincoln", country: "USA", logoUrl: "", createdAt: new Date() },
  { name: "Jeep", slug: "jeep", country: "USA", logoUrl: "", createdAt: new Date() },
  { name: "Dodge", slug: "dodge", country: "USA", logoUrl: "", createdAt: new Date() },
  { name: "RAM", slug: "ram", country: "USA", logoUrl: "", createdAt: new Date() },
  { name: "Tesla", slug: "tesla", country: "USA", logoUrl: "", createdAt: new Date() },
  { name: "Rivian", slug: "rivian", country: "USA", logoUrl: "", createdAt: new Date() },
  { name: "Lucid", slug: "lucid", country: "USA", logoUrl: "", createdAt: new Date() },
  { name: "BYD", slug: "byd", country: "China", logoUrl: "", createdAt: new Date() },
  { name: "Geely", slug: "geely", country: "China", logoUrl: "", createdAt: new Date() },
  { name: "Chery", slug: "chery", country: "China", logoUrl: "", createdAt: new Date() },
  { name: "MG", slug: "mg", country: "United Kingdom", logoUrl: "", createdAt: new Date() },
];

export async function seedManufacturers(): Promise<{ seeded: number; skipped: number }> {
  const manufacturersCollection = collection(db, "manufacturers");
  const snapshot = await getDocs(query(manufacturersCollection, where("slug", "in", manufacturers.map((m) => m.slug))));
  
  const existingSlugs = new Set<string>();
  snapshot.forEach((doc) => {
    existingSlugs.add(doc.data().slug);
  });

  let seeded = 0;
  let skipped = 0;

  for (const manufacturer of manufacturers) {
    if (existingSlugs.has(manufacturer.slug)) {
      skipped += 1;
      continue;
    }

    // Use addDoc to avoid document ID conflicts
    await addDoc(collection(db, "manufacturers"), manufacturer);
    seeded += 1;
  }

  return { seeded, skipped };
}