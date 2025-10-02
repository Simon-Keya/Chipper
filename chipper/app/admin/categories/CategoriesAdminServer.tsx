"use client";

import { useEffect, useState } from "react";
import CategoryForm from "../../../components/CategoryForm";
import { Category } from "../../../lib/types";

export default function CategoriesAdminServer({ token }: { token: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false); // 👈 toggle form
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.statusText}`);
        }

        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Could not load categories. You can still create one below.");
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, [token]);

  // Handle "edit-category" event to open form with prefilled data
  useEffect(() => {
    function handleEdit(e: CustomEvent) {
      setEditCategory(e.detail);
      setShowForm(true);
    }
    window.addEventListener("edit-category", handleEdit as EventListener);
    return () => {
      window.removeEventListener("edit-category", handleEdit as EventListener);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 bg-base-100">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-primary">
        Manage Categories
      </h1>

      {/* Show Add button when form is hidden */}
      {!showForm && (
        <div className="mb-8 flex justify-end">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditCategory(null); // reset edit state
              setShowForm(true);
            }}
          >
            ➕ Add New Category
          </button>
        </div>
      )}

      {/* Form only appears if Add/Edit is active */}
      {showForm && (
        <div
          id="category-form"
          className="card bg-base-200 shadow-xl p-6 mb-12 rounded-2xl border border-base-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-neutral-content">
              {editCategory
                ? `Edit ${editCategory.name}`
                : "Add New Category"}
            </h2>
            <button
              className="btn btn-sm btn-ghost text-neutral"
              onClick={() => setShowForm(false)}
            >
              ✖ Close
            </button>
          </div>
          <CategoryForm
            token={token}
            category={editCategory || undefined}
          />
        </div>
      )}

      {/* Category List */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
        Category List
      </h2>

      {loading ? (
        <p className="text-center py-6 text-neutral-content">Loading...</p>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-error mb-4">{error}</p>
        </div>
      ) : categories.length > 0 ? (
        <div className="overflow-x-auto bg-base-200 rounded-2xl shadow-lg border border-base-300">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-300">
                <th className="text-neutral font-semibold">ID</th>
                <th className="text-neutral font-semibold">Name</th>
                <th className="text-neutral font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-base-100">
                  <td>{category.id}</td>
                  <td className="font-medium">{category.name}</td>
                  <td className="flex gap-2 justify-center">
                    <button
                      className="btn btn-primary btn-sm rounded-full hover:btn-accent"
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent("edit-category", { detail: category })
                        )
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm rounded-full"
                      onClick={async () => {
                        if (confirm(`Delete ${category.name}?`)) {
                          await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${category.id}`,
                            {
                              method: "DELETE",
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );
                          window.location.reload();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-neutral-content text-lg mb-4">
            No categories found. Click Add New Category above to create one.
          </p>
        </div>
      )}
    </div>
  );
}
