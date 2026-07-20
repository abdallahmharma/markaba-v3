import { useState } from "react";
import type { Manufacturer } from "../../types/manufacturer";

interface ManufacturerFormProps {
  onSubmit: (data: Omit<Manufacturer, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
  initialData?: Manufacturer;
}

export function ManufacturerForm({ onSubmit, onCancel, initialData }: ManufacturerFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [country, setCountry] = useState(initialData?.country ?? "");
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({ name, slug, country, logoUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save manufacturer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>{initialData ? "Edit Manufacturer" : "Create Manufacturer"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="logoUrl">Logo URL</label>
          <input
            id="logoUrl"
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}