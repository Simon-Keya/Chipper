'use client';

import { useEffect, useState } from 'react';
import { createProduct, updateProduct } from '../lib/api';
import { Category } from '../lib/types';

interface ProductFormProps {
  categories: Category[];
  token: string;
}

export default function ProductForm({ categories, token }: ProductFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);

  // Handle edit product event
  useEffect(() => {
    const handleEdit = (event: Event) => {
      const product = (event as CustomEvent).detail;
      setEditProductId(product.id);
      setName(product.name);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setCategoryId(product.categoryId.toString());
      setDescription(product.description || '');
      setImage(null);
    };
    window.addEventListener('edit-product', handleEdit);
    return () => window.removeEventListener('edit-product', handleEdit);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageUrl = editProductId ? (await fetchProduct(editProductId)).imageUrl : '';

      // Handle image upload if new file selected
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'chipper_products');

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error?.message || 'Image upload failed');
        imageUrl = uploadData.secure_url;
      }

      const productData = {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: parseInt(categoryId),
        description,
        imageUrl,
      };

      if (editProductId) {
        await updateProduct(editProductId, productData, token);
      } else {
        await createProduct(productData, token);
      }

      handleReset();
      window.location.reload();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEditProductId(null);
    setName('');
    setPrice('');
    setStock('');
    setCategoryId('');
    setDescription('');
    setImage(null);
    setError('');
  };

  return (
    <form
      id="product-form"
      onSubmit={handleSubmit}
      className="card bg-base-100 shadow-xl border border-base-200 p-6 rounded-2xl space-y-6 transition hover:shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-primary mb-4">
        {editProductId ? '✏️ Edit Product' : '➕ Create Product'}
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left side */}
        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="label font-medium">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Price with Ksh prefix */}
          <div>
            <label className="label font-medium">Price (Ksh)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Ksh</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input input-bordered w-full rounded-lg pl-12 focus:ring-2 focus:ring-primary"
                step="0.01"
                min="0"
                placeholder="Enter price"
                required
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="label font-medium">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="input input-bordered w-full rounded-lg focus:ring-2 focus:ring-primary"
              min="0"
              placeholder="Available stock"
              required
            />
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="label font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="select select-bordered w-full rounded-lg focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="label font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full rounded-lg min-h-[100px] focus:ring-2 focus:ring-primary"
              placeholder="Write a short description..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="label font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="file-input file-input-bordered w-full rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && <p className="text-error bg-error/10 p-2 rounded-md">{error}</p>}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="btn btn-primary flex-1 rounded-lg hover:btn-accent transition-all"
          disabled={loading}
        >
          {loading ? 'Saving...' : editProductId ? 'Update Product' : 'Create Product'}
        </button>
        {editProductId && (
          <button
            type="button"
            className="btn btn-outline flex-1 rounded-lg"
            onClick={handleReset}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// Helper to fetch product for editing
async function fetchProduct(id: number): Promise<{ imageUrl: string }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch product');
  return await res.json();
}
