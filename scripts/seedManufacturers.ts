import { seedManufacturers } from "../src/services/manufacturerSeeder";

async function main() {
  try {
    await seedManufacturers();
    console.log("Manufacturers seeding completed.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();