import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

export interface ManufacturerData {
  id: string;
  name: string;
  slug: string;
  country: string;
  logoUrl: string;
  createdAt: Date;
  active: boolean;
}

const manufacturers: Omit<ManufacturerData, "id">[] = [
  // Japan
  {
    name: "Toyota",
    slug: "toyota",
    country: "Japan",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Lexus",
    slug: "lexus",
    country: "Japan",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Honda",
    slug: "honda",
    country: "Japan",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Acura",
    slug: "acura",
    country: "Japan",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Nissan",
    slug: "nissan",
    country: "Japan",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Infiniti",
    slug: "infiniti",
    country: "Japan",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Mazda",
    slug: "mazda",
    country: "Japan",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Subaru",
    slug: "subaru",
    country: "Japan",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Suzuki",
    slug: "suzuki",
    country: "Japan",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Mitsubishi",
    slug: "mitsubishi",
    country: "Japan",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Daihatsu",
    slug: "daihatsu",
    country: "Japan",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Isuzu",
    slug: "isuzu",
    country: "Japan",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },

  // South Korea
  {
    name: "Hyundai",
    slug: "hyundai",
    country: "South Korea",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Kia",
    slug: "kia",
    country: "South Korea",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Genesis",
    slug: "genesis",
    country: "South Korea",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },

  // Germany
  {
    name: "Mercedes-Benz",
    slug: "mercedes-benz",
    country: "Germany",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "BMW",
    slug: "bmw",
    country: "Germany",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Audi",
    slug: "audi",
    country: "Germany",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Volkswagen",
    slug: "volkswagen",
    country: "Germany",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Porsche",
    slug: "porsche",
    country: "Germany",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Opel",
    slug: "opel",
    country: "Germany",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },

  // USA
  {
    name: "Ford",
    slug: "ford",
    country: "USA",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Chevrolet",
    slug: "chevrolet",
    country: "USA",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "GMC",
    slug: "gmc",
    country: "USA",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Jeep",
    slug: "jeep",
    country: "USA",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Dodge",
    slug: "dodge",
    country: "USA",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Chrysler",
    slug: "chrysler",
    country: "USA",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Cadillac",
    slug: "cadillac",
    country: "USA",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Lincoln",
    slug: "lincoln",
    country: "USA",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },

  // United Kingdom
  {
    name: "Land Rover",
    slug: "land-rover",
    country: "United Kingdom",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Jaguar",
    slug: "jaguar",
    country: "United Kingdom",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "MINI",
    slug: "mini",
    country: "United Kingdom",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },

  // Italy
  {
    name: "Fiat",
    slug: "fiat",
    country: "Italy",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Alfa Romeo",
    slug: "alfa-romeo",
    country: "Italy",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Ferrari",
    slug: "ferrari",
    country: "Italy",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Lamborghini",
    slug: "lamborghini",
    country: "Italy",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Maserati",
    slug: "maserati",
    country: "Italy",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },

  // France
  {
    name: "Peugeot",
    slug: "peugeot",
    country: "France",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Renault",
    slug: "renault",
    country: "France",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Citroen",
    slug: "citroen",
    country: "France",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },

  // China
  {
    name: "MG",
    slug: "mg",
    country: "China",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "BYD",
    slug: "byd",
    country: "China",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Geely",
    slug: "geely",
    country: "China",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Chery",
    slug: "chery",
    country: "China",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Jetour",
    slug: "jetour",
    country: "China",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Exeed",
    slug: "exeed",
    country: "China",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Haval",
    slug: "haval",
    country: "China",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Great Wall",
    slug: "great-wall",
    country: "China",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "Tank",
    slug: "tank",
    country: "China",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
  {
    name: "GAC",
    slug: "gac",
    country: "China",
    logoUrl: "",
    createdAt: new Date(),
    active: true,
  },
];

/**
 * Seeds manufacturers into Firestore.
 * This function is idempotent - it will not create duplicates.
 */
export async function seedManufacturers(): Promise<void> {
  const manufacturersRef = collection(db, "manufacturers");

  for (const manufacturer of manufacturers) {
    // Check if manufacturer already exists
    const q = query(
      manufacturersRef,
      where("slug", "==", manufacturer.slug),
      limit(1)
    );

    const snapshot = await getDocs(q);

    // If already exists, skip
    if (!snapshot.empty) {
      continue;
    }

    // Add to Firestore
    await addDoc(manufacturersRef, manufacturer);
  }
}