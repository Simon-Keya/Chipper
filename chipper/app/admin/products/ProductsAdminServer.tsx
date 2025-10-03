'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import ProductForm from '../../../components/ProductForm';
import { deleteProduct, fetchCategories, fetchProducts } from '../../../lib/api';
import { Category, Product } from '../../../lib/types';

interface ProductsAdminServerProps {
  token: string;
}

export default function ProductsAdminServer({ token }: ProductsAdminServerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Could not load products. Try again.');
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadProducts(), loadCategories()]);
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id, token);
      await loadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleEdit = (product: Product) => {
    setShowForm(true);
    document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' });
    const event = new CustomEvent('edit-product', { detail: product });
    window.dispatchEvent(event);
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-base-100">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-primary">
        Manage Products
      </h1>

      {/* Product Form Section */}
      <div
        id="product-form"
        className="card bg-base-200 shadow-xl p-6 mb-12 rounded-2xl border border-base-300"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-neutral-content">
            Add / Edit Product
          </h2>
          {!showForm ? (
            <button
              className="btn btn-primary btn-sm rounded-full"
              onClick={() => setShowForm(true)}
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
        {showForm && <ProductForm onSuccess={loadProducts} />}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="card bg-base-200 shadow-md p-4 rounded-2xl border border-base-300">
              {p.imageUrl && (
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              )}
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
              <p className="mt-2 font-bold text-success">Ksh.{p.price.toFixed(2)}</p>
              <p className="text-sm">Stock: {p.stock}</p>
              <p className="text-sm">
                Category: {categories.find((c) => c.id === p.categoryId)?.name || 'Unknown'}
              </p>
              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={() => handleEdit(p)}
                  className="btn btn-sm btn-primary rounded-full"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="btn btn-sm btn-error rounded-full"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
