"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Save, XCircle } from "lucide-react";

interface CategoryFormProps {
  token: string;
  category?: { id: number; name: string }; // optional for editing
}

export default function CategoryForm({ token, category }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Prefill when editing
  useEffect(() => {
    if (category) {
      setName(category.name);
      setEditCategoryId(category.id);
    } else {
      resetForm();
    }
  }, [category]);

  function resetForm() {
    setName("");
    setEditCategoryId(null);
    setMessage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const endpoint = editCategoryId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${editCategoryId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

      const method = editCategoryId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error(
          `Failed to ${editCategoryId ? "update" : "create"} category`
        );
      }

      setMessage(
        `✅ Category ${editCategoryId ? "updated" : "created"} successfully!`
      );
      resetForm();

      // Instead of reload — tell parent to refresh categories
      window.dispatchEvent(new CustomEvent("refresh-categories"));
    } catch (err: any) {
      setMessage(`❌ ${err.message || "Something went wrong."}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card bg-base-100 shadow-md border border-base-200 p-6 rounded-2xl transition hover:shadow-lg w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-2 text-primary flex items-center gap-2">
        {editCategoryId ? "✏️ Edit Category" : "➕ Add New Category"}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        {editCategoryId
          ? "Update the category details below."
          : "Create a new category to organize products."}
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 items-center"
      >
        {/* Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            className="input input-bordered w-full pl-4 pr-10 py-3 rounded-xl focus:ring-2 focus:ring-primary transition"
            placeholder="Enter category name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className={`btn ${editCategoryId ? "btn-accent" : "btn-primary"} rounded-xl flex items-center gap-2 px-6`}
          disabled={loading}
        >
          {loading ? (
            <>
              <Save className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : editCategoryId ? (
            <>
              <Save className="w-4 h-4" /> Update
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" /> Add
            </>
          )}
        </button>

        {/* Cancel when editing */}
        {editCategoryId && (
          <button
            type="button"
            onClick={resetForm}
            className="btn btn-outline btn-error rounded-xl flex items-center gap-2 px-6"
          >
            <XCircle className="w-4 h-4" /> Cancel
          </button>
        )}
      </form>

      {/* Message */}
      {message && (
        <div
          className={`mt-4 text-sm p-3 rounded-lg transition ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
