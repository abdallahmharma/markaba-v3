import { useState, useEffect } from "react";
import type { Manufacturer } from "../../types/manufacturer";
import { getManufacturers, createManufacturer, updateManufacturer, deleteManufacturer } from "../../services/manufacturer.service";
import { ManufacturerForm } from "../../components/forms/ManufacturerForm";

type FormMode = "create" | "edit" | null;

export default function ManufacturersAdminPage() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
  const [error, setError] = useState<string | null>(null);

   const loadManufacturers = async () => {
     try {
       setLoading(true);
       const list = await getManufacturers();
      setManufacturers(list);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load manufacturers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManufacturers();
  }, []);

   const handleCreate = async (data: Omit<Manufacturer, "id" | "createdAt">) => {
     await createManufacturer(data);
    handleCloseForm();
    await loadManufacturers();
  };

   const handleUpdate = async (data: Omit<Manufacturer, "id" | "createdAt">) => {
     if (!editingManufacturer) return;
     await updateManufacturer(editingManufacturer.id, data);
    handleCloseForm();
    await loadManufacturers();
  };

   const handleDelete = async (id: string) => {
     if (!confirm("Are you sure you want to delete this manufacturer?")) return;
     await deleteManufacturer(id);
    await loadManufacturers();
  };

  const handleEdit = (manufacturer: Manufacturer) => {
    setEditingManufacturer(manufacturer);
    setFormMode("edit");
  };

  const handleCloseForm = () => {
    setFormMode(null);
    setEditingManufacturer(null);
  };

  if (loading) {
    return <p>Loading manufacturers...</p>;
  }

  return (
    <div>
      <h1>Manufacturers</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {formMode === null && (
        <>
          <button onClick={() => setFormMode("create")}>Create Manufacturer</button>

          <table border={1} cellPadding={8} cellSpacing={0}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Slug</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {manufacturers.map((mfr) => (
                <tr key={mfr.id}>
                  <td>{mfr.name}</td>
                  <td>{mfr.country}</td>
                  <td>{mfr.slug}</td>
                  <td>
                    <button onClick={() => handleEdit(mfr)}>Edit</button>{" "}
                    <button onClick={() => handleDelete(mfr.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {formMode === "create" && (
        <ManufacturerForm onSubmit={handleCreate} onCancel={handleCloseForm} />
      )}

      {formMode === "edit" && editingManufacturer && (
        <ManufacturerForm onSubmit={handleUpdate} onCancel={handleCloseForm} initialData={editingManufacturer} />
      )}
    </div>
  );
}