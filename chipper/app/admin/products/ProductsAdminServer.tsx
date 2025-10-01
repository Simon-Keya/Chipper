"use client";

import { useEffect, useState } from "react";
import ProductForm from "../../../components/ProductForm";
import { Category, Product } from "../../../lib/types";

export default function ProductsAdminServer({ token }: { token: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error("Failed to load products/categories:", err);
        setError("Could not load products. You can still create one below.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-12 bg-base-100">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-primary">
        Manage Products
      </h1>

      {/* Product Form Section (button + form inside card, same as Categories) */}
      <div
        id="product-form"
        className="card bg-base-200 shadow-xl p-6 mb-12 rounded-2xl border border-base-300"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-neutral-content">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>

          {!showForm ? (
            <button
              className="btn btn-primary btn-sm rounded-full"
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
            >
              ➕ Add New Product
            </button>
          ) : (
            <button
              className="btn btn-secondary btn-sm rounded-full"
              onClick={() => setShowForm(false)}
            >
              ✖ Close Form
            </button>
          )}
        </div>

        {showForm && (
          <ProductForm
            categories={categories}
            token={token}
            initialData={editingProduct || undefined}
          />
        )}
      </div>

      {/* Product List */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
        Product List
      </h2>

      {loading ? (
        <p className="text-center py-6 text-neutral-content">Loading...</p>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-error mb-4">{error}</p>
        </div>
      ) : products.length > 0 ? (
        <div className="overflow-x-auto bg-base-200 rounded-2xl shadow-lg border border-base-300">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-300">
                <th className="text-neutral font-semibold">ID</th>
                <th className="text-neutral font-semibold">Name</th>
                <th className="text-neutral font-semibold">Price</th>
                <th className="text-neutral font-semibold">Category</th>
                <th className="text-neutral font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-base-100">
                  <td>{product.id}</td>
                  <td className="line-clamp-1 font-medium">{product.name}</td>
                  <td className="text-success font-semibold">
                    ${product.price.toFixed(2)}
                  </td>
                  <td>{product.category?.name}</td>
                  <td className="flex gap-2 justify-center">
                    <button
                      className="btn btn-primary btn-sm rounded-full hover:btn-accent"
                      onClick={() => {
                        setEditingProduct(product);
                        setShowForm(true);
                        document
                          .getElementById("product-form")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm rounded-full"
                      onClick={async () => {
                        if (confirm(`Delete ${product.name}?`)) {
                          await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/products/${product.id}`,
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
            No products found. Start by adding your first one above.
          </p>
        </div>
      )}
    </div>
  );
}
