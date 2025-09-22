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
      setEditProductId(null);
      setName('');
      setPrice('');
      setStock('');
      setCategoryId('');
      setDescription('');
      setImage(null);
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
    <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="label text-neutral-content font-medium">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full rounded-lg"
          required
          aria-required="true"
        />
      </div>
      <div>
        <label className="label text-neutral-content font-medium">Price ($)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input input-bordered w-full rounded-lg"
          step="0.01"
          required
          aria-required="true"
        />
      </div>
      <div>
        <label className="label text-neutral-content font-medium">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="input input-bordered w-full rounded-lg"
          required
          aria-required="true"
        />
      </div>
      <div>
        <label className="label text-neutral-content font-medium">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="select select-bordered w-full rounded-lg"
          required
          aria-required="true"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label text-neutral-content font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full rounded-lg"
        />
      </div>
      <div>
        <label className="label text-neutral-content font-medium">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="file-input file-input-bordered w-full rounded-lg"
        />
      </div>
      {error && <p className="text-error text-sm">{error}</p>}
      <div className="flex gap-4">
        <button
          type="submit"
          className="btn btn-primary flex-1 rounded-lg hover:bg-accent transition-colors duration-300"
          disabled={loading}
          aria-label={editProductId ? 'Update Product' : 'Create Product'}
        >
          {loading ? 'Saving...' : editProductId ? 'Update Product' : 'Create Product'}
        </button>
        {editProductId && (
          <button
            type="button"
            className="btn btn-outline btn-secondary flex-1 rounded-lg"
            onClick={handleReset}
            aria-label="Cancel Edit"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// Helper to fetch product for imageUrl in edit mode
async function fetchProduct(id: number): Promise<{ imageUrl: string }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch product');
  const product = await res.json();
  return { imageUrl: product.imageUrl };
}
