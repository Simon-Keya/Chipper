import { Metadata } from 'next';
import ProductForm from '../../../components/ProductForm';
import { fetchCategories, fetchProducts } from '../../../lib/api';
import { Category, Product } from '../../../lib/types';

export const metadata: Metadata = {
  metadataBase: new URL('https://chipper-store.com'),
  title: 'Manage Products - Chipper Admin',
  description: 'Create, edit, and manage products for the Chipper e-commerce platform.',
};

export default async function ProductsAdminServer({ token }: { token: string }) {
  const [products, categories]: [Product[], Category[]] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-12 bg-base-100">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-neutral-content">Manage Products</h1>
      <div className="card bg-base-200 shadow-lg p-6 mb-12 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-neutral-content">Add/Edit Product</h2>
        <ProductForm categories={categories} token={token} />
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-neutral-content">Product List</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full bg-neutral rounded-xl">
          <thead>
            <tr>
              <th className="text-neutral-content">ID</th>
              <th className="text-neutral-content">Name</th>
              <th className="text-neutral-content">Price</th>
              <th className="text-neutral-content">Category</th>
              <th className="text-neutral-content">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td className="line-clamp-1">{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.category.name}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm rounded-full mr-2 hover:bg-accent transition-colors duration-300"
                    onClick={() => {
                      document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' });
                      // Pass product data to form via client-side state or URL
                      window.dispatchEvent(
                        new CustomEvent('edit-product', { detail: product })
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
                        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${product.id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` },
                        });
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
      </div>
      {products.length === 0 && (
        <p className="text-neutral-content text-lg mt-6 text-center">No products found.</p>
      )}
    </div>
  );
}