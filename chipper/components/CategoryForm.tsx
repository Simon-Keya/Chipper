'use client';

import { PlusCircle, Save, Upload, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CategoryFormProps {
  token: string;
  category?: { id: number; name: string; imageUrl?: string };
  onSuccess?: () => void;
}

export default function CategoryForm({ token, category, onSuccess }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);

  // Prefill when editing
  useEffect(() => {
    if (category) {
      setName(category.name);
      setEditCategoryId(category.id);
      setImagePreview(category.imageUrl || null);
    } else {
      resetForm();
    }
  }, [category]);

  const resetForm = () => {
    setName("");
    setImageFile(null);
    setImagePreview(null);
    setEditCategoryId(null);
    setMessage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Category name is required");
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const endpoint = editCategoryId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${editCategoryId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

      const method = editCategoryId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          // Let browser set Content-Type with boundary for FormData
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errData.error || "Failed to save category");
      }

      setMessage(`Category ${editCategoryId ? "updated" : "created"} successfully!`);
      resetForm();
      onSuccess?.();
      window.dispatchEvent(new CustomEvent("refresh-categories"));
    } catch (err) {
      setMessage(err instanceof Error ? `Error: ${err.message}` : "Error: Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-2xl border border-base-200 p-8 rounded-3xl max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">
        {editCategoryId ? "Edit Category" : "Create New Category"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <div className="flex flex-col items-center">
          <label className="block mb-3 font-semibold text-base-content/90">
            Category Image
          </label>

          <div className="relative group">
            <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-dashed border-base-300 bg-base-200 flex items-center justify-center">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={192}
                  height={192}
                  className="rounded-2xl object-cover"
                />
              ) : (
                <div className="text-center text-base-content/40">
                  <Upload className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">No image selected</p>
                </div>
              )}
            </div>

            <label className="absolute bottom-2 right-2 btn btn-primary btn-circle shadow-lg cursor-pointer">
              <Upload className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block mb-2 font-semibold text-base-content/90">
            Category Name
          </label>
          <input
            type="text"
            placeholder="e.g., Electronics, Clothing, Home & Living"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full input-lg rounded-2xl focus:input-primary transition"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end pt-6 border-t border-base-200">
          {editCategoryId && (
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-ghost btn-lg rounded-2xl"
              disabled={loading}
            >
              <XCircle className="w-5 h-5" /> Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg rounded-2xl px-10 shadow-xl"
          >
            {loading ? (
              <>
                <Save className="w-5 h-5 animate-spin" /> Saving...
              </>
            ) : editCategoryId ? (
              <>
                <Save className="w-5 h-5" /> Update Category
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" /> Create Category
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success/Error Message */}
      {message && (
        <div className={`alert ${message.includes("Error") ? "alert-error" : "alert-success"} mt-6 shadow-lg`}>
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}