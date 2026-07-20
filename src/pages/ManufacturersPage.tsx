/**
 * Manufacturers Page - Sprint 3
 * 
 * Displays list of manufacturers loaded from Firebase.
 */

import { useState, useEffect } from "react";
import type { Manufacturer } from "../types/manufacturer";
import { getManufacturers } from "../services/manufacturer.service";
import Layout from "../components/layout/Layout";

function ManufacturersPage() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchManufacturers() {
      try {
        const data = await getManufacturers();
        setManufacturers(data);
      } catch (err) {
        setError("Failed to load manufacturers");
      } finally {
        setLoading(false);
      }
    }

    fetchManufacturers();
  }, []);

  return (
    <Layout>
      <h1>Manufacturers</h1>

      {loading && <p>Loading...</p>}

      {!loading && error && <p>{error}</p>}

      {!loading && !error && manufacturers.length === 0 && <p>No manufacturers found.</p>}

      {!loading && !error && manufacturers.length > 0 && (
        <ul>
          {manufacturers.map((manufacturer) => (
            <li key={manufacturer.id}>
              {manufacturer.name}
              {manufacturer.country && <span> - {manufacturer.country}</span>}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}

export default ManufacturersPage;