import { Metadata } from "next";
import CategoryForm from "../../../components/CategoryForm";
import { fetchCategories } from "../../../lib/api";
import { Category } from "../../../lib/types";

export const metadata: Metadata = {
  metadataBase: new URL("https://chipper-store.com"),
  title: "Manage Categories - Chipper Admin",
  description:
    "Create, edit, and manage categories for the Chipper e-commerce platform.",
};

export default async function CategoriesAdminServer({
  token,
}: {
  token: string;
}) {
  const categories: Category[] = await fetchCategories();

  return (
    <div className="container mx-auto px-4 py-12 bg-base-100">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-primary">
        Manage Categories
      </h1>

      {/* Category Form */}
      <div
        id="category-form"
        className="card bg-base-200 shadow-xl p-6 mb-12 rounded-2xl border border-base-300"
      >
        <h2 className="text-2xl font-semibold mb-4 text-neutral-content">
          Add / Edit Category
        </h2>
        <CategoryForm token={token} />
      </div>

      {/* Category List */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
        Category List
      </h2>
      <div className="overflow-x-auto bg-base-200 rounded-2xl shadow-lg border border-base-300">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-300">
              <th className="text-neutral font-semibold">ID</th>
              <th className="text-neutral font-semibold">Name</th>
              <th className="text-neutral font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-base-100">
                <td>{category.id}</td>
                <td className="font-medium">{category.name}</td>
                <td className="flex gap-2 justify-center">
                  <button
                    className="btn btn-primary btn-sm rounded-full hover:btn-accent transition-colors duration-300"
                    onClick={() => {
                      document
                        .getElementById("category-form")
                        ?.scrollIntoView({ behavior: "smooth" });
                      window.dispatchEvent(
                        new CustomEvent("edit-category", { detail: category })
                      );
                    }}
                    aria-label={`Edit category ${category.name}`}
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
                    aria-label={`Delete category ${category.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="text-neutral-content text-lg py-6 text-center">
            No categories found.
          </p>
        )}
      </div>
    </div>
  );
}

