import { Metadata } from "next";
import ProductForm from "../../../components/ProductForm";
import { fetchCategories, fetchProducts } from "../../../lib/api";
import { Category, Product } from "../../../lib/types";

export const metadata: Metadata = {
  metadataBase: new URL("https://chipper-store.com"),
  title: "Manage Products - Chipper Admin",
  description:
    "Create, edit, and manage products for the Chipper e-commerce platform.",
};

export default async function ProductsAdminServer({ token }: { token: string }) {
  const [products, categories]: [Product[], Category[]] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-12 bg-base-100">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-primary">
        Manage Products
      </h1>

      {/* Product Form */}
      <div
        id="product-form"
        className="card bg-base-200 shadow-xl p-6 mb-12 rounded-2xl border border-base-300"
      >
        <h2 className="text-2xl font-semibold mb-4 text-neutral-content">
          Add / Edit Product
        </h2>
        <ProductForm categories={categories} token={token} />
      </div>

      {/* Product List */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
        Product List
      </h2>
      <div className="overflow-x-auto bg-base-200 rounded-2xl shadow-lg border border-base-300">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-300">
              <th className="text-neutral font-semibold">ID</th>
              <th className="text-neutral font-semibold">Name</th>
              <th className="text-neutral font-semibold">Price</th>
              <th className="text-neutral font-semibold">Category</th>
              <th className="text-neutral font-semibold text-center">Actions</th>
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
                <td>{product.category.name}</td>
                <td className="flex gap-2 justify-center">
                  <button
                    className="btn btn-primary btn-sm rounded-full hover:btn-accent transition-colors duration-300"
                    onClick={() => {
                      document
                        .getElementById("product-form")
                        ?.scrollIntoView({ behavior: "smooth" });
                      window.dispatchEvent(
                        new CustomEvent("edit-product", { detail: product })
                      );
                    }}
                    aria-label={`Edit product ${product.name}`}
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
                    aria-label={`Delete product ${product.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-neutral-content text-lg py-6 text-center">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
